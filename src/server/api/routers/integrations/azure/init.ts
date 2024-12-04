import { PolicyClient } from "@azure/arm-policy";
import { PolicyInsightsClient } from "@azure/arm-policyinsights";
import { ResourceManagementClient } from "@azure/arm-resources";
import { SubscriptionClient } from "@azure/arm-subscriptions";
import { DefaultAzureCredential } from "@azure/identity";
import { LogsQueryClient } from "@azure/monitor-query";
import { Client, Options } from "@microsoft/microsoft-graph-client";

async function initializeAzureClient(accessToken: string) {
  try {
    // console.log("initializeAzureClient...", accessToken);

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

function getAzureCredentials(token: string) {
  // console.log("Getting Azure credentials...", accessToken);
  const credential = {
    getToken: async () => {
      return {
        token,
        expiresOnTimestamp: Date.now() + 3600 * 1000, // Adjust as per token expiration
      };
    },
  };
  return credential;
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
const logsQueryClient = new LogsQueryClient(credential);

export {
  credential,
  getAzureCredentials,
  initializeAzureClient,
  logsQueryClient,
  policyClient,
  policyInsightsClient,
  resourceClient,
  subscriptionClient,
  subscriptionId,
};
