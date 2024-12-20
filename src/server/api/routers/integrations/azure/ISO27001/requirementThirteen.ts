import { MonitorClient } from "@azure/arm-monitor";
import { PolicyClient, PolicyDefinition } from "@azure/arm-policy";
import { PolicyInsightsClient } from "@azure/arm-policyinsights";
import { ResourceManagementClient } from "@azure/arm-resources";
import { ControlStatus } from "~/lib/types/controls";
import { AzureAUth, evaluate, saveEvidence } from "../../common";
import { asyncIteratorToArray } from "../common";
import { getCredentials } from "../init";

async function getComplianceReports({
  controlName,
  controlId,
  organisationId,
  subscriptionId,
  policyClient,
  policyInsightsClient,
  resourceClient,
}: {
  controlName: string;
  controlId: string;
  organisationId: string;
  subscriptionId: string;
  policyClient: PolicyClient;
  policyInsightsClient: PolicyInsightsClient;
  resourceClient: ResourceManagementClient;
}) {
  try {
    const evd_name = `Compliance reports`;
    const evidence = [];

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
      return ControlStatus.Enum.NOT_IMPLEMENTED;
    }

    // Get all policy definitions in the subscription
    const policyDefinitionIterator =
      await policyClient.policyDefinitions.list();
    const policyDefinitions: PolicyDefinition[] = await asyncIteratorToArray(
      policyDefinitionIterator
    );

    let compliantCount = 0;
    let nonCompliantCount = 0;
    let partiallyCompliantCount = 0;

    for (const policy of policyDefinitions) {
      if (!policy.name) continue;
      const complianceResults =
        await policyInsightsClient.policyStates.summarizeForPolicyDefinition(
          subscriptionId,
          policy.name
        );
      evidence.push({
        policyName: policy.name,
        complianceResults,
      });

      const summary = complianceResults.value?.[0]?.results || {};
      const nonCompliantResources = summary.nonCompliantResources || 0;
      const compliantResources = totalResources - nonCompliantResources;

      if (compliantResources > 0 && nonCompliantResources === 0) {
        compliantCount++;
      } else if (compliantResources === 0 && nonCompliantResources > 0) {
        nonCompliantCount++;
      } else if (compliantResources > 0 && nonCompliantResources > 0) {
        partiallyCompliantCount++;
      }
    }

    await saveEvidence({
      fileName: `Azure-${controlName}-${evd_name}`,
      body: { evidence },
      controls: ["ISO27001-1"],
      controlId,
      organisationId,
    });

    // Determine overall compliance status
    if (
      compliantCount > 0 &&
      nonCompliantCount === 0 &&
      partiallyCompliantCount === 0
    ) {
      return ControlStatus.Enum.FULLY_IMPLEMENTED;
    } else if (
      nonCompliantCount > 0 &&
      compliantCount === 0 &&
      partiallyCompliantCount === 0
    ) {
      return ControlStatus.Enum.NOT_IMPLEMENTED;
    } else {
      return ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
    }
  } catch (error) {
    console.error("Error checking compliance:", error);
    throw error;
  }
}

async function getAuditLogs({
  controlName,
  controlId,
  organisationId,
  subscriptionId,
  monitorClient,
  resourceClient,
}: {
  controlName: string;
  controlId: string;
  organisationId: string;
  subscriptionId: string;
  monitorClient: MonitorClient;
  resourceClient: ResourceManagementClient;
}) {
  try {
    const evd_name = `Audit logs`;
    const evidence = [];

    // Get all resources in the subscription
    const resourcesIterator = await resourceClient.resources.list();
    const resources = await asyncIteratorToArray(resourcesIterator);

    let implementedCount = 0;
    let partiallyImplementedCount = 0;
    let totalResources = 0;

    // Iterate over resources to check diagnostic settings
    for (const resource of resources) {
      const resourceUri = resource.id;
      if (!resourceUri) continue;

      totalResources++;
      try {
        const diagnosticSettingsRes =
          await monitorClient.diagnosticSettings.list(resourceUri);
        const diagnosticSettings = diagnosticSettingsRes.value || [];

        evidence.push({
          resourceUri,
          diagnosticSettings,
        });

        if (diagnosticSettings.length > 0) {
          const hasLogs = diagnosticSettings.some((setting) => {
            if (!setting.logs) return false;
            return setting.logs?.length > 0;
          });
          const hasMetrics = diagnosticSettings.some((setting) => {
            if (!setting.metrics) return false;
            return setting.metrics?.length > 0;
          });

          if (hasLogs && hasMetrics) {
            implementedCount++;
          } else if (hasLogs || hasMetrics) {
            partiallyImplementedCount++;
          }
        }
      } catch (error: any) {
        console.error(
          `Error checking diagnostics for resource ${resourceUri}:`,
          error.message
        );
      }
    }

    await saveEvidence({
      fileName: `Azure-${controlName}-${evd_name}`,
      body: { evidence },
      controls: ["ISO27001-1"],
      controlId,
      organisationId,
    });

    if (implementedCount === totalResources) {
      return ControlStatus.Enum.FULLY_IMPLEMENTED;
    } else if (implementedCount === 0 && partiallyImplementedCount === 0) {
      return ControlStatus.Enum.NOT_IMPLEMENTED;
    } else {
      return ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
    }
  } catch (error: any) {
    console.error("Error checking monitoring and audit status:", error.message);
    throw error;
  }
}

async function getRequirementThirteenStatus({
  azureCloud,
  controlName,
  controlId,
  organisationId,
}: AzureAUth) {
  if (!azureCloud) throw new Error("Azure cloud is required");
  const { credential, subscriptionId } = getCredentials(azureCloud);
  const policyClient = new PolicyClient(credential, subscriptionId);
  const policyInsightsClient = new PolicyInsightsClient(
    credential,
    subscriptionId
  );
  const resourceClient = new ResourceManagementClient(
    credential,
    subscriptionId
  );
  const monitorClient = new MonitorClient(credential, subscriptionId);

  return evaluate([
    () =>
      getComplianceReports({
        controlName,
        controlId,
        organisationId,
        subscriptionId,
        policyClient,
        policyInsightsClient,
        resourceClient,
      }),
    () =>
      getAuditLogs({
        controlName,
        controlId,
        organisationId,
        subscriptionId,
        monitorClient,
        resourceClient,
      }),
  ]);
}

export { getRequirementThirteenStatus };
