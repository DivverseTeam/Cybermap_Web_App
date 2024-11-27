import { PolicyInsightsClient } from "@azure/arm-policyinsights";
import { credential, resourceClient } from "../init";

async function getPolicyStatusForSubscription(subscriptionId: string) {
  let status = "Fully implemented"; // Default to Fully implemented

  try {
    const resources = [];
    for await (const resource of resourceClient.resources.list()) {
      resources.push(resource);
    }
    const totalResources = resources.length;

    if (totalResources === 0) {
      status = "Not implemented";
      return status;
    }

    // Fetch compliance results for the subscription
    const policyInsightsClient = new PolicyInsightsClient(
      credential,
      subscriptionId
    );
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
      status = "Not implemented"; // No resources governed by any policy
    } else if (ungovernedResources > 0) {
      status = "Partially implemented (some resources lack policies)";
    } else if (nonCompliantResources > 0) {
      status = "Partially implemented";
    }

    // Default status remains "Fully implemented" if all resources are governed and compliant
  } catch (error) {
    console.error(`Error processing subscription ${subscriptionId}:`, error);
    status = "Error";
  }

  return status;
}
