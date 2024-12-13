//@ts-nocheck
import { ControlStatus } from "~/lib/types/controls";
import { AZURE_CLOUD_SLUG } from "~/lib/types/integrations";
import Control from "~/server/models/Control";
import Integration from "~/server/models/Integration";
import Organisation from "~/server/models/Organisation";
import { getAzureRefreshToken } from "../../integrations/azure/init";
import { AzureAUth } from "../../integrations/common";
import { getAccessControl } from "./accessControls";
import { getAssetManagement } from "./assetManagement";
import { getHumanResourceSecurity } from "./humanResourceSecurity";
import { getInformationSecurityPolicies } from "./informationSecurityPolicies";
import { getOrganizationOfInformationSecurity } from "./organizationofInformationSecurity";

const ISO27001_FUNCTIONS: {
  [key: string]: (auth: AzureAUth) => Promise<ControlStatus | undefined>;
} = {
  ISP: (auth: AzureAUth) => getInformationSecurityPolicies(auth),
  OIS: (auth: AzureAUth) => getOrganizationOfInformationSecurity(auth),
  HRS: (auth: AzureAUth) => getHumanResourceSecurity(auth),
  ACC: (auth: AzureAUth) => getAccessControl(auth),
  ASM: (auth: AzureAUth) => getAssetManagement(auth),
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

      const controls = await Control.find(
        { organisationId: organization._id },
        "_id code"
      ).lean();

      await Promise.all(
        controls.map(async (control) => {
          if (ISO27001_FUNCTIONS[control.code]) {
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

            await Control.findByIdAndUpdate(
              control._id,
              { status },
              { upsert: true }
            );
            console.log(`${organization.name} - ${control.name} - ${status}`);
          }
        })
      );
    }
  } catch (error: any) {
    console.error("Error during ISO27001 audit:", error);
    if (
      error.code === "ExpiredAuthenticationToken" ||
      error.code === "InvalidAuthenticationToken"
    ) {
      console.error("Token expired. Please re-authenticate.......");
      const integrations: any[] = await Promise.all(
        AZURE_CLOUD_SLUG.map(async (slug) => {
          return await Integration.findOne(
            {
              organisationId: currentOrganisationId,
              slug,
            },
            "authData subscriptionId slug tenantId"
          ).lean();
        })
      );
      if (integrations.length) {
        const tokens = await getAzureRefreshToken(integrations);
        console.log("Refreshed.....", tokens);
        if (tokens && tokens.length) {
          for (const token of tokens) {
            if (token?.token) {
              await Integration.findOneAndUpdate(
                {
                  organisationId: currentOrganisationId,
                  slug: token.slug,
                },
                {
                  $set: {
                    "authData.accessToken": token.token.accessToken,
                    "authData.expiry": token.token.expiry,
                    "authData.refreshToken": token.token.refreshToken,
                  },
                }
              );
            }
          }
        }
      }
    }
  }
}
