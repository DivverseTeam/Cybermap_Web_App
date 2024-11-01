import { guardDutyClient } from "./init";
import {
  ListFindingsCommand,
  GetFindingsCommand,
} from "@aws-sdk/client-guardduty";

// Monitoring system configurations: Evidence of continuous monitoring in place for critical infrastructure.
// Alert configurations: Proof of alerts set for security breaches, resource overloads, or downtime.

/**
 * Retrieves and logs all findings from AWS GuardDuty.
 * @param {string} detectorId - The ID of the GuardDuty detector in your account.
 */
async function getAllFindings(detectorId: any) {
  try {
    // Step 1: List all finding IDs
    const listFindingsParams = { DetectorId: detectorId };
    const listFindingsCommand = new ListFindingsCommand(listFindingsParams);
    const listFindingsResponse = await guardDutyClient.send(
      listFindingsCommand
    );
    const findingIds = listFindingsResponse.FindingIds;

    if (!findingIds?.length) {
      console.log("No findings found.");
      return;
    }

    // Step 2: Get detailed findings information
    const getFindingsParams = {
      DetectorId: detectorId,
      FindingIds: findingIds,
    };
    const getFindingsCommand = new GetFindingsCommand(getFindingsParams);
    const getFindingsResponse = await guardDutyClient.send(getFindingsCommand);

    // Output findings
    console.log(
      "Findings:",
      JSON.stringify(getFindingsResponse.Findings, null, 2)
    );
  } catch (error) {
    console.error("Error retrieving GuardDuty findings:", error);
  }
}

// // Example usage
// const detectorId = 'your-detector-id-here'; // Replace with your GuardDuty Detector ID
// getAllFindings(detectorId);
