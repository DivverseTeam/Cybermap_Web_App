import { PolicyInsightsClient } from "@azure/arm-policyinsights";
import { ResourceManagementClient } from "@azure/arm-resources";
import { ControlStatus } from "~/lib/types/controls";
import { AzureAUth, evaluate } from "../../common";
import { StaticTokenCredential } from "../../common/azureTokenCredential";

async function getPolicyStatusForSubscription(
  subscriptionId: string,
  resourceClient: ResourceManagementClient,
  policyInsightsClient: PolicyInsightsClient
) {
  console.log("getPolicyStatusForSubscription...");
  let status: ControlStatus = ControlStatus.Enum.FULLY_IMPLEMENTED;

  try {
    const resources = [];
    for await (const resource of resourceClient.resources.list()) {
      console.log("Resource:", resource);
      resources.push(resource);
    }
    const totalResources = resources.length;

    if (totalResources === 0) {
      status = ControlStatus.Enum.NOT_IMPLEMENTED;
      return status;
    }

    // Fetch compliance results for the subscription
    const complianceResults =
      await policyInsightsClient.policyStates.summarizeForSubscription(
        subscriptionId
      );

    const summary = complianceResults.value?.[0]?.results || {};
    const nonCompliantResources = summary.nonCompliantResources || 0;
    const compliantResources = totalResources - nonCompliantResources;
    const ungovernedResources = totalResources - compliantResources;

    // Determine the subscription status
    if (compliantResources === 0) {
      status = ControlStatus.Enum.NOT_IMPLEMENTED; // No resources governed by any policy
    } else if (ungovernedResources > 0) {
      status = ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
    } else if (nonCompliantResources > 0) {
      status = ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
    }

    // Default status remains "Fully implemented" if all resources are governed and compliant
  } catch (error: any) {
    console.error(
      `Error getPolicyStatusForSubscription ${subscriptionId}:`,
      error.message
    );
    return null;
  }

  return status;
}

async function getChangeLogStatus(
  subscriptionId: string,
  policyInsightsClient: PolicyInsightsClient
) {
  try {
    const policyEventsIterator =
      await policyInsightsClient.policyEvents.listQueryResultsForSubscription(
        subscriptionId,
        {
          queryOptions: {
            filter: "complianceState eq 'NonCompliant'",
          },
        }
      );
    let totalLogs = 0;
    let compliantLogs = 0;
    let nonCompliantLogs = 0;

    for await (const event of policyEventsIterator) {
      totalLogs++;
      if (event.complianceState === "Compliant") {
        compliantLogs++;
      } else if (event.complianceState === "NonCompliant") {
        nonCompliantLogs++;
      }
    }

    if (totalLogs === 0) {
      return ControlStatus.Enum.NOT_IMPLEMENTED;
    } else if (nonCompliantLogs > 0) {
      return ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
    } else {
      return ControlStatus.Enum.FULLY_IMPLEMENTED;
    }
  } catch (error) {
    console.error("Error getChangeLogStatus:", error);
    return null;
  }
}

async function getRequirementOneStatus({ azureCloud }: AzureAUth) {
  if (!azureCloud) throw new Error("Azure cloud is required");
  const { token, expiresOnTimestamp, subscriptionId } = azureCloud;
  const credential = new StaticTokenCredential({
    token,
    expiresOnTimestamp,
  });
  // console.log("getRequirementOneStatus...", credential);
  const resourceClient = new ResourceManagementClient(
    credential,
    subscriptionId
  );
  const policyInsightsClient = new PolicyInsightsClient(
    credential,
    subscriptionId
  );
  await evaluate([
    () =>
      getPolicyStatusForSubscription(
        subscriptionId,
        resourceClient,
        policyInsightsClient
      ),
    () => getChangeLogStatus(subscriptionId, policyInsightsClient),
  ]);
}

export { getRequirementOneStatus };
