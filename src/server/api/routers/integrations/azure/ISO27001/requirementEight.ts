import { EventData, MonitorClient } from "@azure/arm-monitor";
import { SecurityCenter } from "@azure/arm-security";
import { ControlStatus } from "~/lib/types/controls";
import {
  AzureAUth,
  evaluate,
  getStatusByCount,
  saveEvidence,
} from "../../common";
import { asyncIteratorToArray } from "../common";
import { getCredentials } from "../init";

async function getOperationAuditLogs({
  controlName,
  controlId,
  subscriptionId,
  organisationId,
  monitorClient,
}: {
  controlName: string;
  controlId: string;
  organisationId: string;
  subscriptionId: string;
  monitorClient: MonitorClient;
}) {
  try {
    const evd_name = `Operations audit logs`;
    // Fetch activity logs for the last 7 days
    const endTime = new Date();
    const startTime = new Date();
    startTime.setDate(endTime.getDate() - 7);

    const filter = `eventTimestamp ge '${startTime.toISOString()}' and eventTimestamp le '${endTime.toISOString()}'`;

    // const activityLogs = await monitorClient.activityLogs.list(filter);

    const activityLogsIterator = await monitorClient.activityLogs.list(filter);
    const activityLogs: EventData[] = await asyncIteratorToArray(
      activityLogsIterator
    );
    await saveEvidence({
      fileName: `Azure-${controlName}-${evd_name}`,
      body: {
        evidence: activityLogs,
      },
      controls: ["ISO27001-1"],
      controlId,
      organisationId,
    });

    let userActivityCount = 0;
    let systemChangeCount = 0;

    for (const log of activityLogs) {
      if (log.operationName && log.operationName.value.includes("User")) {
        userActivityCount++;
      }
      if (log.operationName && log.operationName.value.includes("System")) {
        systemChangeCount++;
      }
    }

    // Evaluate tracking status
    if (userActivityCount > 0 && systemChangeCount > 0) {
      return ControlStatus.Enum.FULLY_IMPLEMENTED;
    } else if (userActivityCount > 0 || systemChangeCount > 0) {
      return ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
    } else {
      return ControlStatus.Enum.NOT_IMPLEMENTED;
    }
  } catch (error) {
    throw error;
  }
}

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
      }
    });

    return getStatusByCount({
      fullyImplemented: statusCounts.implemented,
      notImplemented: statusCounts.notImplemented,
      partiallyImplemented: statusCounts.partiallyImplemented,
    });
  } catch (error) {
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
  return evaluate(
    [
      () =>
        getOperationAuditLogs({
          controlName,
          controlId,
          organisationId,
          subscriptionId,
          monitorClient,
        }),
      () =>
        getSecurityIncidentLogs({
          controlName,
          controlId,
          organisationId,
          subscriptionId,
          securityClient,
        }),
    ],
    [azureCloud.integrationId]
  );
}

export { getRequirementEightStatus };
