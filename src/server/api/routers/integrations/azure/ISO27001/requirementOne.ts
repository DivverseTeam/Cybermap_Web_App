import { PolicyInsightsClient } from "@azure/arm-policyinsights";
import { ResourceManagementClient } from "@azure/arm-resources";
import { ControlStatus } from "~/lib/types/controls";
import { AzureAUth, evaluate, saveEvidence } from "../../common";
import { asyncIteratorToArray } from "../common";
import { getCredentials } from "../init";

async function getPolicyStatusForSubscription({
  organisationId,
  controlId,
  controlName,
  subscriptionId,
  resourceClient,
  policyInsightsClient,
}: {
  subscriptionId: string;
  resourceClient: ResourceManagementClient;
  policyInsightsClient: PolicyInsightsClient;
  controlId: string;
  organisationId: string;
  controlName: string;
}) {
  const evd_name = `Security policy documentation`;
  let status: ControlStatus = ControlStatus.Enum.FULLY_IMPLEMENTED;

  const resourcesIterator = await resourceClient.resources.list();
  const resources = await asyncIteratorToArray(resourcesIterator);

  const totalResources = resources.length;

  if (totalResources === 0) {
    await saveEvidence({
      fileName: `Azure-${controlName}-${evd_name}`,
      body: { evidence: [] },
      controls: ["ISO27001-1"],
      controlId,
      organisationId,
    });
    status = ControlStatus.Enum.NOT_IMPLEMENTED;
    return status;
  }

  // Fetch compliance results for the subscription
  const complianceResults =
    await policyInsightsClient.policyStates.summarizeForSubscription(
      subscriptionId
    );
  await saveEvidence({
    fileName: `Azure-${controlName}-${evd_name}`,
    body: { evidence: complianceResults },
    controls: ["ISO27001-1"],
    controlId,
    organisationId,
  });

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

  return status;
}

async function getChangeLogStatus({
  organisationId,
  controlId,
  controlName,
  subscriptionId,
  policyInsightsClient,
}: {
  organisationId: string;
  controlId: string;
  controlName: string;
  subscriptionId: string;
  policyInsightsClient: PolicyInsightsClient;
}) {
  const evd_name = `Change logs`;
  const policyEventsIterator =
    await policyInsightsClient.policyEvents.listQueryResultsForSubscription(
      subscriptionId,
      {
        queryOptions: {
          filter: "complianceState eq 'NonCompliant'",
        },
      }
    );
  await saveEvidence({
    fileName: `Azure-${controlName}-${evd_name}`,
    body: { evidence: policyEventsIterator },
    controls: ["ISO27001-1"],
    controlId,
    organisationId,
  });

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
}

async function getRequirementOneStatus({
  azureCloud,
  controlId,
  controlName,
  organisationId,
}: AzureAUth) {
  if (!azureCloud) throw new Error("Azure cloud is required");
  const { credential, subscriptionId } = getCredentials(azureCloud);
  const resourceClient = new ResourceManagementClient(
    credential,
    subscriptionId
  );
  const policyInsightsClient = new PolicyInsightsClient(
    credential,
    subscriptionId
  );
  return evaluate(
    [
      () =>
        getPolicyStatusForSubscription({
          subscriptionId,
          resourceClient,
          policyInsightsClient,
          controlId,
          controlName,
          organisationId,
        }),
      () =>
        getChangeLogStatus({
          subscriptionId,
          policyInsightsClient,
          controlId,
          controlName,
          organisationId,
        }),
    ],
    [azureCloud.integrationId]
  );
}

export { getRequirementOneStatus };
