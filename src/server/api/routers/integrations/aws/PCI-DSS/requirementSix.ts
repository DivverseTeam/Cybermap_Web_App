import { ListFindingsCommand } from "@aws-sdk/client-inspector2";
import { DescribePatchBaselinesCommand } from "@aws-sdk/client-ssm";
import { inspector2Client, ssmClient } from "../init";

// Function to get patching logs
async function getPatchingLogs() {
  try {
    const command = new DescribePatchBaselinesCommand({});
    const response = await ssmClient.send(command);
    console.log("Patching Logs: ", response);
    return response; // Contains details of patch baselines
  } catch (error) {
    console.error("Error retrieving patching logs:", error);
  }
}

// Function to get vulnerability scan findings
async function getVulnerabilityScans() {
  try {
    const command = new ListFindingsCommand({});
    const response = await inspector2Client.send(command);
    console.log("Vulnerability Scan Findings: ", response);
    return response; // Contains list of findings
  } catch (error) {
    console.error("Error retrieving vulnerability scans:", error);
  }
}

export async function getEvidence() {
  const patchingLogs = await getPatchingLogs();
  const vulnerabilityScans = await getVulnerabilityScans();

  return {
    patchingLogs,
    vulnerabilityScans,
  };
}
