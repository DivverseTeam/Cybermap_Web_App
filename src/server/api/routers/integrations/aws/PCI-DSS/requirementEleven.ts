// // Requirement 11: Regularly test security systems and processes

// import { ListFindingsCommand } from "@aws-sdk/client-inspector2";
// import {
//   GetFindingsCommand,
//   ListFindingsCommand as GuardListFindingsCommand,
// } from "@aws-sdk/client-guardduty";
// import { guardDutyClient, inspector2Client } from "../init";

// // const AWS = require('aws-sdk');
// // const inspector = new AWS.Inspector2(); // For AWS Inspector
// // const guardduty = new AWS.GuardDuty(); // For AWS GuardDuty

// // Function to Retrieve AWS Inspector Findings
// async function getInspectorFindings() {
//   try {
//     const command = new ListFindingsCommand({});
//     const response = await inspector2Client.send(command);
//     return response.findings || [];
//   } catch (error) {
//     console.error("Error retrieving Inspector findings:", error);
//     throw error;
//   }
// }

// // Function to Retrieve AWS GuardDuty Findings
// async function getGuardDutyFindings(detectorId: string) {
//   const params = {
//     DetectorId: detectorId,
//     // MaxResults: 50, // Adjust as needed
//     // FindingCriteria: {
//     //     // Add any filters for specific finding types or severities, if necessary
//     // },
//   };

//   try {
//     const command = new GuardListFindingsCommand(params);
//     const response = await guardDutyClient.send(command);
//     if (!response.FindingIds || response.FindingIds.length === 0) {
//       return [];
//     }
//     const findingsDetails = await Promise.all(
//       response.FindingIds.map(async (findingId) => {
//         const command2 = new GetFindingsCommand({
//           DetectorId: detectorId,
//           FindingIds: [findingId],
//         });
//         return await guardDutyClient.send(command2);
//       })
//     );
//     return findingsDetails.flat();
//   } catch (error) {
//     console.error("Error retrieving GuardDuty findings:", error);
//     throw error;
//   }
// }

// export async function getEvidence() {
//   const inspectorFindings = await getInspectorFindings();
//   const guardDutyFindings = await getGuardDutyFindings("your-detector-id");

//   return { inspectorFindings, guardDutyFindings };
// }
