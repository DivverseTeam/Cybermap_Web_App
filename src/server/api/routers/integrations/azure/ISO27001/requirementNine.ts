import { NetworkManagementClient } from "@azure/arm-network";
import { ControlStatus } from "~/lib/types/controls";
import { AzureAUth, evaluate, saveEvidence } from "../../common";
import { asyncIteratorToArray } from "../common";
import { getCredentials } from "../init";

async function getNetworkEncryptionLogs({
  controlName,
  controlId,
  subscriptionId,
  organisationId,
  networkClient,
}: {
  controlName: string;
  controlId: string;
  organisationId: string;
  subscriptionId: string;
  networkClient: NetworkManagementClient;
}) {
  try {
    const evd_name = `Network encryption logs`;
    // Retrieve all NSGs in the subscription
    const nsgListIterator = await networkClient.networkSecurityGroups.listAll();
    const nsgList = await asyncIteratorToArray(nsgListIterator);

    await saveEvidence({
      fileName: `Azure-${controlName}-${evd_name}`,
      body: {
        evidence: nsgList,
      },
      controls: ["ISO27001-1"],
      controlId,
      organisationId,
    });

    if (!nsgList || nsgList.length === 0) {
      return ControlStatus.Enum.NOT_IMPLEMENTED; // No NSGs found
    }

    let hasPartiallyImplemented = false;
    let allImplemented = true;

    // Process each NSG
    for (const nsg of nsgList) {
      const securityRules = nsg.securityRules || [];
      if (securityRules.length === 0) {
        allImplemented = false;
        continue;
      }

      let hasFullyImplemented = false;
      let hasPartialImplementation = false;

      for (const rule of securityRules) {
        if (
          rule.access === "Allow" &&
          rule.direction === "Inbound" &&
          rule.priority
        ) {
          hasFullyImplemented = true; // Rule meets implementation criteria
        } else {
          hasPartialImplementation = true; // Rule doesn't meet full criteria
        }
      }

      if (hasFullyImplemented && hasPartialImplementation) {
        hasPartiallyImplemented = true;
      } else if (!hasFullyImplemented) {
        allImplemented = false;
      }
    }

    if (hasPartiallyImplemented) {
      return ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
    } else if (allImplemented) {
      return ControlStatus.Enum.FULLY_IMPLEMENTED;
    } else {
      return ControlStatus.Enum.NOT_IMPLEMENTED;
    }
  } catch (error: any) {
    console.error("Error fetching NSGs or security rules:", error.message);
    return null;
  }
}

async function getRequirementNineStatus({
  azureCloud,
  controlName,
  controlId,
  organisationId,
}: AzureAUth) {
  if (!azureCloud) throw new Error("Azure cloud is required");
  const { credential, subscriptionId } = getCredentials(azureCloud);
  const networkClient = new NetworkManagementClient(credential, subscriptionId);
  return evaluate([
    () =>
      getNetworkEncryptionLogs({
        controlName,
        controlId,
        organisationId,
        subscriptionId,
        networkClient,
      }),
  ]);
}

export { getRequirementNineStatus };
