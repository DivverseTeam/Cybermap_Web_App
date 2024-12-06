import { PolicyClient } from "@azure/arm-policy";
import { PolicyInsightsClient } from "@azure/arm-policyinsights";
import { ResourceManagementClient } from "@azure/arm-resources";
import { SubscriptionClient } from "@azure/arm-subscriptions";
import { DefaultAzureCredential } from "@azure/identity";
import { Client, Options } from "@microsoft/microsoft-graph-client";
import axios from "axios";
import { AuthorizationCode } from "simple-oauth2";
import {
  MICROSOFT_OAUTH_ARM_SCOPE,
  getOauth2Config,
} from "~/server/constants/integrations";
import { OrganisationIntegration } from "~/server/models/Integration";
import { AzureToken } from "../common";
import { StaticTokenCredential } from "../common/azureTokenCredential";

async function initializeAzureClient(accessToken: string) {
  try {
    const options: Options = {
      authProvider: (done) => {
        done(null, accessToken);
      },
    };

    const azureClient = Client.init(options);

    return azureClient;
  } catch (error: any) {
    if (error.response) {
      // Response received but with an error status code
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request);
    } else {
      // Error setting up the request
      console.error("Request error:", error.message);
    }
    throw error; // Re-throw error after logging
  }
}

function getCredentials(azureCloud: AzureToken) {
  const { token, expiresOnTimestamp, subscriptionId } = azureCloud;
  const credential = new StaticTokenCredential({
    token,
    expiresOnTimestamp,
  });
  return { credential, subscriptionId };
}

async function getAzureRefreshToken(integrations: OrganisationIntegration[]) {
  try {
    if (!integrations.length) {
      throw new Error("No Azure integrations found.");
    }
    for (const integration of integrations) {
      const authData = integration?.authData;
      const slug = integration.slug;
      if (slug === "azure-cloud" && authData) {
        const { accessToken, expiry } = authData;
        const client = new AuthorizationCode(
          getOauth2Config({
            ...integration,
            provider: "MICROSOFT",
          } as any)
        );
        const token = client.createToken({
          access_token: accessToken,
          // refresh_token: refreshToken,
          expires_in: new Date(expiry.getTime()).toISOString(),
        });
        if (!token.expired()) return;
        const refreshedToken = await fetchAccessToken(
          integration.tenantId as string
        );
        return refreshedToken;
      }
      if (slug === "azure-ad" && authData) {
        const { accessToken, refreshToken, expiry } = authData;
        const client = new AuthorizationCode(
          getOauth2Config({
            ...integration,
            provider: "MICROSOFT",
          } as any)
        );
        const token = client.createToken({
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: new Date(expiry.getTime()).toISOString(),
        });
        if (!token.expired()) return;
        const refreshedToken = await token.refresh();
        return refreshedToken.token;
      }
    }
  } catch (error: any) {
    console.error("Error refreshing access token:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data, // Log Azure's error response details
    });
  }
}

async function fetchAccessToken(tenantId: string) {
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const clientId = process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.AZURE_CLIENT_SECRET;

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", clientId!);
  params.append("client_secret", clientSecret!);
  params.append("scope", MICROSOFT_OAUTH_ARM_SCOPE);

  try {
    const response = await axios.post(tokenUrl, params);
    return response.data.access_token;
  } catch (error: any) {
    console.error(
      "Error fetching access token:",
      error.response?.data || error.message
    );
    throw error;
  }
}

const credential = new DefaultAzureCredential();
const subscriptionId = "73e5682b-5036-44f8-88e6-ade2ab6c3405";

const subscriptionClient = new SubscriptionClient(credential);
const policyClient = new PolicyClient(credential);
const resourceClient = new ResourceManagementClient(credential, subscriptionId);
const policyInsightsClient = new PolicyInsightsClient(
  credential,
  subscriptionId
);
export {
  credential,
  fetchAccessToken,
  getAzureRefreshToken,
  getCredentials,
  initializeAzureClient,
  // logsQueryClient,
  policyClient,
  policyInsightsClient,
  resourceClient,
  subscriptionClient,
  subscriptionId,
};
