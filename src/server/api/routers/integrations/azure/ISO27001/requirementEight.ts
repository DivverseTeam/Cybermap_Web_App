import { MonitorClient } from "@azure/arm-monitor";
import { SecurityCenter } from "@azure/arm-security";
import {
  AzureAUth,
  evaluate,
  getStatusByCount,
  saveEvidence,
} from "../../common";
import { getCredentials } from "../init";
import { asyncIteratorToArray } from "../common";

// async function getOperationAuditLogs(monitorClient: MonitorClient) {
//   try {

//     // Sample KQL query to check log presence
//     const query = {
//       query: "Heartbeat | take 1", // Example query: check for any Heartbeat logs
//     };

//     // Execute the query using Log Analytics
//     const response = await monitorClient.;

//     // Analyze the response
//     if (response.tables && response.tables.length > 0) {
//       const rows = response.tables[0].rows;
//       if (rows.length > 0) {
//         return "Implemented"; // Logs are present, API is operational
//       } else {
//         return "Partially Implemented"; // API is available but no logs detected
//       }
//     } else {
//       return "Not Implemented"; // No data returned, potentially not implemented
//     }
//   } catch (error: any) {
//     console.error("Error while checking Azure Monitor API status:", error);

//     // Handle errors to infer status
//     if (error.code === "ResourceNotFound") {
//       return ControlStatus.Enum.NOT_IMPLEMENTED; // API feature not found
//     }
//     if (error.code === "AuthorizationFailed") {
//       return ControlStatus.Enum.PARTIALLY_IMPLEMENTED; // API is available but access is restricted
//     }
//     throw error; // Rethrow unexpected errors
//   }
// }

async function getSecurityIncidentLogs({
  controlName,
  controlId,
  subscriptionId,
  organisationId,
  securityClient,
}: {
  controlName: string;
  controlId: string;
  organisationId: string;
  subscriptionId: string;
  securityClient: SecurityCenter;
}) {
  try {
    // Retrieve secure scores
    const evd_name = `Security incident logs`;

    const secureScoresIterator = await securityClient.secureScores.list();
    const secureScores = await asyncIteratorToArray(secureScoresIterator);

    // Retrieve secure score controls
    const secureScoreControlsIterator =
      await securityClient.secureScoreControls.list();
    const secureScoreControls = await asyncIteratorToArray(
      secureScoreControlsIterator
    );

    // Retrieve assessments
    const assessmentsIterator = await securityClient.assessments.list(
      `/subscriptions/${subscriptionId}`
    );
    const assessments = await asyncIteratorToArray(assessmentsIterator);

    // Retrieve sub-assessments
    let subAssessments = [];
    for (const assessment of assessments) {
      if (assessment.name) {
        const subAssessmentsIterator = await securityClient.subAssessments.list(
          `/subscriptions/${subscriptionId}`,
          assessment.name
        );
        subAssessments = await asyncIteratorToArray(subAssessmentsIterator);
      }
    }

    await saveEvidence({
      fileName: `Azure-${controlName}-${evd_name}`,
      body: {
        evidence: {
          secureScores,
          secureScoreControls,
          assessments,
          subAssessments,
        },
      },
      controls: ["ISO27001-1"],
      controlId,
      organisationId,
    });
    // Categorize recommendations by status
    const statusCounts = {
      implemented: 0,
      notImplemented: 0,
      partiallyImplemented: 0,
    };

    if (secureScoreControls.length) {
      const healthyResourceCount = secureScoreControls.reduce(
        (sum, control) => sum + (control.healthyResourceCount || 0),
        0
      );
      const unhealthyResourceCount = secureScoreControls.reduce(
        (sum, control) => sum + (control.unhealthyResourceCount || 0),
        0
      );
      const notApplicableResourceCount = secureScoreControls.reduce(
        (sum, control) => sum + (control.notApplicableResourceCount || 0),
        0
      );

      statusCounts.implemented += healthyResourceCount;
      statusCounts.notImplemented += unhealthyResourceCount;
      statusCounts.partiallyImplemented += notApplicableResourceCount;
    }

    assessments.forEach((assessment) => {
      switch (assessment.status?.code) {
        case "Healthy":
          statusCounts.implemented++;
          break;
        case "Unhealthy":
          statusCounts.notImplemented++;
          break;
        case "PartiallyHealthy":
          statusCounts.partiallyImplemented++;
          break;
        default:
          console.warn(`Unknown assessment status: ${assessment.status}`);
      }
    });

    subAssessments.forEach((subAssessment) => {
      switch (subAssessment.status?.code) {
        case "Healthy":
          statusCounts.implemented++;
          break;
        case "Unhealthy":
          statusCounts.notImplemented++;
          break;
        case "PartiallyHealthy":
          statusCounts.partiallyImplemented++;
          break;
        default:
          console.warn(
            `Unknown sub-assessment status: ${subAssessment.status}`
          );
      }
    });

    return getStatusByCount({
      fullyImplemented: statusCounts.implemented,
      notImplemented: statusCounts.notImplemented,
      partiallyImplemented: statusCounts.partiallyImplemented,
    });
  } catch (error) {
    console.error("Error while checking security incident logs:", error);
    throw error;
  }
}

async function getRequirementEightStatus({
  azureCloud,
  controlName,
  controlId,
  organisationId,
}: AzureAUth) {
  if (!azureCloud) throw new Error("Azure cloud is required");
  const { credential, subscriptionId } = getCredentials(azureCloud);
  const monitorClient = new MonitorClient(credential, subscriptionId);
  const securityClient = new SecurityCenter(credential, subscriptionId);
  return evaluate([
    // () => getOperationAuditLogs(monitorClient),
    () =>
      getSecurityIncidentLogs({
        controlName,
        controlId,
        organisationId,
        subscriptionId,
        securityClient,
      }),
  ]);
}

export { getRequirementEightStatus };
