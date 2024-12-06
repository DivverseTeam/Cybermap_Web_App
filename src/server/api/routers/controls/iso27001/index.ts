import { AZURE_CLOUD_SLUG } from "~/lib/types/integrations";
import Control from "~/server/models/Control";
import Integration from "~/server/models/Integration";
import Organisation from "~/server/models/Organisation";
import UserControlMapping from "~/server/models/UserControlMapping";
import { getAzureRefreshToken } from "../../integrations/azure/init";
import { AzureAUth } from "../../integrations/common";
import { getInformationSecurityPolicies } from "./informationSecurityPolicies";
import { getOrganizationOfInformationSecurity } from "./organizationofInformationSecurity";

const ISO27001_FUNCTIONS: any = {
  ISP: (auth: AzureAUth) => getInformationSecurityPolicies(auth),
  OIS: (auth: AzureAUth) => getOrganizationOfInformationSecurity(auth),
  // HRS: (auth: AzureAUth) => getHumanResourceSecurity(auth),
  // ACC: (auth: AzureAUth) =>  getAccessControl(auth),
};

export async function runIso27001() {
  let currentOrganisationId = "";

  try {
    const allOrganizations: any = await Organisation.find(
      {},
      "_id name"
    ).lean();
    if (!allOrganizations.length) {
      console.log("No organizations found.");
      return;
    }
    console.log("Performing audit for all organizations...");

    for (const organization of allOrganizations) {
      console.log(`Performing audit for organization: ${organization.name}`);
      currentOrganisationId = organization._id;
      const integrations = await Promise.all(
        AZURE_CLOUD_SLUG.map(async (slug) => {
          return await Integration.findOne(
            {
              organisationId: organization._id,
              slug,
            },
            "authData subscriptionId"
          ).lean();
        })
      );
      // console.log("Integrations", integrations);

      const [azureADIntegration, azureCloudIntegration] = integrations;
      // console.log("Integrations", azureADIntegration, azureCloudIntegration);

      if (!azureADIntegration && !azureCloudIntegration) continue;
      if (!azureADIntegration?.authData && !azureCloudIntegration?.authData)
        continue;

      const controls = await Control.find({}, "_id code").lean();

      await Promise.all(
        controls.slice(0, 13).map(async (control) => {
          if (
            organization.name === "Veyron World" &&
            ISO27001_FUNCTIONS[control.code]
          ) {
            const status = await ISO27001_FUNCTIONS[control.code]({
              azureCloud: azureCloudIntegration
                ? {
                    token: azureCloudIntegration.authData.accessToken,
                    expiresOnTimestamp:
                      azureCloudIntegration.authData.expiry?.getTime(),
                    subscriptionId: azureCloudIntegration.subscriptionId,
                  }
                : null,
              azureAd: azureADIntegration
                ? {
                    token: azureADIntegration.authData.accessToken,
                    expiresOnTimestamp:
                      azureADIntegration.authData.expiry?.getTime(),
                    subscriptionId: azureADIntegration.subscriptionId,
                  }
                : null,
            });

            await UserControlMapping.findOneAndUpdate(
              {
                controlId: control._id,
                organisationId: organization._id,
              },
              { status },
              { upsert: true }
            );
          }
        })
      );
    }
  } catch (error: any) {
    console.error("Error during ISO27001 audit:", error);
    if (error.code === "ExpiredAuthenticationToken") {
      console.error("Token expired. Please re-authenticate.");
      const integrations = await Promise.all(
        AZURE_CLOUD_SLUG.map(async (slug) => {
          return await Integration.findOne(
            {
              organisationId: currentOrganisationId,
              slug,
            },
            "authData subscriptionId"
          ).lean();
        })
      );
      if (!integrations.length) {
        const token = await getAzureRefreshToken(integrations);
        console.log("Refreshed token", token);
      }
    }
  }
}
