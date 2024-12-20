import { ControlStatus } from "~/lib/types/controls";
import { AzureAUth, evaluate, saveEvidence } from "../../common";
import { getCredentials } from "../init";

import { PolicyClient, PolicyDefinition } from "@azure/arm-policy";
import { PolicyInsightsClient, PolicyState } from "@azure/arm-policyinsights";
import { LogsQueryClient } from "@azure/monitor-query";
import { StaticTokenCredential } from "../../common/azureTokenCredential";
import { asyncIteratorToArray, getAllLogAnalyticsWorkspaces } from "../common";

async function getPatchingLogs({
  controlName,
  controlId,
  subscriptionId,
  organisationId,
  policyClient,
  policyInsightsClient,
}: {
  controlName: string;
  controlId: string;
  organisationId: string;
  subscriptionId: string;
  policyClient: PolicyClient;
  policyInsightsClient: PolicyInsightsClient;
}) {
  try {
    const evd_name = `Patching logs`;
    const evidence = [];
    const policyDefinitionsIterator =
      await policyClient.policyDefinitions.list();
    const policyDefinitions: PolicyDefinition[] = await asyncIteratorToArray(
      policyDefinitionsIterator
    );

    if (policyDefinitions.length === 0) {
      return ControlStatus.Enum.NOT_IMPLEMENTED;
    }

    // Step 2: Initialize compliance counters
    let compliantCount = 0;
    let nonCompliantCount = 0;

    // Step 3: Analyze compliance for each policy
    for (const policy of policyDefinitions) {
      try {
        const policyStatesIterator =
          await policyInsightsClient.policyStates.listQueryResultsForSubscription(
            "latest", // Use the latest policy states
            subscriptionId,
            {
              queryOptions: {
                filter: `policyAssignmentId eq '${policy.id}'`,
              },
            }
          );
        const policyStates: PolicyState[] = await asyncIteratorToArray(
          policyStatesIterator
        );

        evidence.push({
          policyName: policy.displayName,
          policyStates,
        });

        for (const state of policyStates) {
          if (state.complianceState === "Compliant") {
            compliantCount++;
          } else if (state.complianceState === "NonCompliant") {
            nonCompliantCount++;
          }
        }
      } catch (error: any) {
        console.warn(
          `Error fetching compliance for policy ${policy.displayName}:`,
          error.message
        );
      }
    }

    await saveEvidence({
      fileName: `Azure-${controlName}-${evd_name}`,
      body: {
        evidence: {
          logs: evidence,
        },
      },
      controls: ["ISO27001-1"],
      controlId,
      organisationId,
    });

    // Step 4: Determine overall compliance status
    if (nonCompliantCount > 0) {
      return ControlStatus.Enum.NOT_IMPLEMENTED;
    } else if (compliantCount > 0) {
      return ControlStatus.Enum.FULLY_IMPLEMENTED;
    } else {
      return ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
    }
  } catch (error) {
    console.error("Error checking system updates compliance:", error);
    throw error;
  }
}

async function getSecurityReviewLogs({
  controlName,
  controlId,
  subscriptionId,
  organisationId,
  credential,
  logsQueryClient,
}: {
  controlName: string;
  controlId: string;
  organisationId: string;
  subscriptionId: string;
  logsQueryClient: LogsQueryClient;
  credential: StaticTokenCredential;
}) {
  try {
    const evd_name = `System security review logs`;

    // Get all Log Analytics workspaces
    const evidence: any = {};
    const { workspacesIds } = await getAllLogAnalyticsWorkspaces({
      credential,
      subscriptionId,
    });

    if (!workspacesIds.length) {
      console.warn("No Log Analytics workspaces found.");
      await saveEvidence({
        fileName: `Azure-${controlName}-${evd_name}`,
        body: {
          evidence,
        },
        controls: ["ISO27001-1"],
        controlId,
        organisationId,
      });
      return ControlStatus.Enum.NOT_IMPLEMENTED;
    }

    // KQL query to find security review logs
    const kqlQuery = `
        SecurityEvent
        | where EventID == 4624 or EventID == 4625
        | summarize count() by bin(TimeGenerated, 1d), Computer
        | order by TimeGenerated desc
    `;

    // Time range for the query (last 30 days)
    const timeRange = { duration: "P30D" };

    // Check logs across all workspaces
    let hasLogs = false;

    for (const workspace of workspacesIds) {
      const queryResult = await logsQueryClient.queryWorkspace(
        workspace,
        kqlQuery,
        timeRange
      );
      evidence[workspace] = queryResult;

      if (queryResult.status === "Success" && queryResult.tables.length > 0) {
        hasLogs = true;
        break; // Exit loop if logs are found
      }
    }

    await saveEvidence({
      fileName: `Azure-${controlName}-${evd_name}`,
      body: {
        evidence,
      },
      controls: ["ISO27001-1"],
      controlId,
      organisationId,
    });

    return hasLogs
      ? ControlStatus.Enum.FULLY_IMPLEMENTED
      : ControlStatus.Enum.NOT_IMPLEMENTED;
  } catch (error) {
    console.error("Error fetching logs:", error);
    return null;
  }
}

async function getRequirementTenStatus({
  azureCloud,
  controlName,
  controlId,
  organisationId,
}: AzureAUth) {
  if (!azureCloud) throw new Error("Azure cloud is required");
  const { credential, subscriptionId } = getCredentials(azureCloud);

  const logsQueryClient = new LogsQueryClient(credential);
  const policyClient = new PolicyClient(credential, subscriptionId);
  const policyInsightsClient = new PolicyInsightsClient(
    credential,
    subscriptionId
  );

  return evaluate([
    () =>
      getPatchingLogs({
        controlName,
        controlId,
        organisationId,
        subscriptionId,
        policyClient,
        policyInsightsClient,
      }),
    () =>
      getSecurityReviewLogs({
        controlName,
        controlId,
        organisationId,
        subscriptionId,
        logsQueryClient,
        credential,
      }),
  ]);
}

export { getRequirementTenStatus };
