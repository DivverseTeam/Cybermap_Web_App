import { ResourceGraphClient } from "@azure/arm-resourcegraph";
import { Alert, SecurityCenter } from "@azure/arm-security";
import { Incident, SecurityInsights } from "@azure/arm-securityinsight";
import { ControlStatus } from "~/lib/types/controls";
import { AzureAUth, evaluate, saveEvidence } from "../../common";
import { asyncIteratorToArray } from "../common";
import { getCredentials } from "../init";

async function getIncidentLogs({
  controlName,
  controlId,
  subscriptionId,
  organisationId,
  securityInsightsClient,
  resourceGraphClient,
}: {
  controlName: string;
  controlId: string;
  organisationId: string;
  subscriptionId: string;
  securityInsightsClient: SecurityInsights;
  resourceGraphClient: ResourceGraphClient;
}) {
  try {
    const evd_name = `Incident logs`;

    const evidence = [];

    // Query all Sentinel-enabled Log Analytics workspaces in the subscription
    const queryResults = await resourceGraphClient.resources({
      subscriptions: [subscriptionId],
      query: `
        Resources
        | where type == "microsoft.operationalinsights/workspaces"
        | where properties.isWorkspaceCodelessConnectorEnabled == true
      `,
    });

    if (!queryResults.data || queryResults.data.length === 0) {
      return ControlStatus.Enum.NOT_IMPLEMENTED; // No Sentinel-enabled workspaces found
    }

    let detected = 0;
    let reported = 0;
    let managed = 0;
    let totalIncidents = 0;

    for (const workspace of queryResults.data) {
      const resourceGroupName = workspace.resourceGroup;
      const workspaceName = workspace.name;

      // List incidents in the workspace
      const incidentsIterator = await securityInsightsClient.incidents.list(
        resourceGroupName,
        workspaceName
      );
      const incidents: Incident[] = await asyncIteratorToArray(
        incidentsIterator
      );

      for (const incident of incidents) {
        evidence.push({
          workspaceName,
          resourceGroupName,
          incident,
        });
        // Check if the incident is detected
        if (incident.status === "New" || incident.status === "Active") {
          detected++;
        }

        // Check if the incident is reported
        if (incident.createdTimeUtc) {
          reported++;
        }

        // Check if the incident is managed
        if (incident.status === "Closed" || incident.status === "Resolved") {
          managed++;
        }

        totalIncidents++;
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

    // Determine the overall status
    if (totalIncidents === 0) {
      return ControlStatus.Enum.NOT_IMPLEMENTED;
    } else if (detected > 0 && reported > 0 && managed > 0) {
      return ControlStatus.Enum.FULLY_IMPLEMENTED;
    } else {
      return ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
    }
  } catch (error) {
    console.error("Error checking security incident status:", error);
    throw error;
  }
}

async function getIncidentResponseLogs({
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
    // List security alerts
    const evd_name = `Incident response logs`;

    const alertsIterator = await securityClient.alerts.list();
    const alerts: Alert[] = await asyncIteratorToArray(alertsIterator);

    // Analyze alerts
    let allImplemented = true;
    let anyNotImplemented = false;

    for (const alert of alerts) {
      if (alert.isIncident) {
        const responseStatus = alert.status; // Example: Alert lifecycle status

        switch (responseStatus) {
          case "Resolved":
            // Incident handled according to procedures
            break;
          case "New":
          case "Active":
            // Incident not handled
            anyNotImplemented = true;
            allImplemented = false;
            break;
          default:
            allImplemented = false;
            console.warn(
              `Unknown response status for alert ID: ${alert.systemAlertId}`
            );
        }
      }
    }

    await saveEvidence({
      fileName: `Azure-${controlName}-${evd_name}`,
      body: {
        evidence: alerts,
      },
      controls: ["ISO27001-1"],
      controlId,
      organisationId,
    });

    // Determine overall compliance status
    if (allImplemented) {
      return ControlStatus.Enum.FULLY_IMPLEMENTED;
    } else if (anyNotImplemented) {
      return ControlStatus.Enum.NOT_IMPLEMENTED;
    } else {
      return ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
    }
  } catch (error: any) {
    console.error("Error checking incident handling:", error.message);
    throw error;
  }
}

async function getRequirementElevenStatus({
  azureCloud,
  controlName,
  controlId,
  organisationId,
}: AzureAUth) {
  if (!azureCloud) throw new Error("Azure cloud is required");
  const { credential, subscriptionId } = getCredentials(azureCloud);
  const securityInsightsClient = new SecurityInsights(
    credential,
    subscriptionId
  );
  const resourceGraphClient = new ResourceGraphClient(credential);
  const securityClient = new SecurityCenter(credential, subscriptionId);
  return evaluate([
    () =>
      getIncidentLogs({
        controlName,
        controlId,
        organisationId,
        subscriptionId,
        securityInsightsClient,
        resourceGraphClient,
      }),
    () =>
      getIncidentResponseLogs({
        controlName,
        controlId,
        organisationId,
        subscriptionId,
        securityClient,
      }),
  ]);
}

export { getRequirementElevenStatus };
