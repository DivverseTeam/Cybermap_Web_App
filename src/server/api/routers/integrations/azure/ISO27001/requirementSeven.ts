import { MonitorClient } from "@azure/arm-monitor";
import { ControlStatus } from "~/lib/types/controls";
import { AzureAUth, evaluate, saveEvidence } from "../../common";
import { asyncIteratorToArray } from "../common";
import { getCredentials } from "../init";

async function getActivityLogsStatus({
  controlId,
  controlName,
  organisationId,
  monitorClient,
}: {
  controlName: string;
  controlId: string;
  organisationId: string;
  monitorClient: MonitorClient;
}) {
  try {
    // Fetch activity logs for the last 7 days
    const evd_name = `Activity logs`;
    const activityLogs = await monitorClient.activityLogs.list(
      `eventTimestamp ge '${new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
      ).toISOString()}'`
    );
    // Analyze the logs
    const logs = await asyncIteratorToArray(activityLogs);
    const logCount = logs.length;
    // console.log("Activity logs", logs);

    await saveEvidence({
      fileName: `Azure-${controlName}-${evd_name}`,
      body: { evidence: logs },
      controls: ["ISO27001-1"],
      controlId,
      organisationId,
    });

    // Determine the status based on log count
    if (logCount > 0) {
      return ControlStatus.Enum.FULLY_IMPLEMENTED; // Logs are generally available
    } else {
      return ControlStatus.Enum.NOT_IMPLEMENTED; // No logs found
    }
  } catch (error) {
    return null;
  }
}

async function getRequirementSevenStatus({
  azureCloud,
  controlId,
  organisationId,
  controlName,
}: AzureAUth) {
  if (!azureCloud) throw new Error("Azure cloud is required");
  const { credential, subscriptionId } = getCredentials(azureCloud);
  const monitorClient = new MonitorClient(credential, subscriptionId);

  return evaluate([
    () =>
      getActivityLogsStatus({
        controlId,
        controlName,
        monitorClient,
        organisationId,
      }),
  ]);
}

export { getRequirementSevenStatus };
