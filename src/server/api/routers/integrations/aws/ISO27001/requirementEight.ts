// import { GetLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";
// import { ListFindingsCommand } from "@aws-sdk/client-guardduty";
// import { cloudWatchLogsClient, guardDutyClient } from "../init";

// /**
//  * Audit Logs: Logs showing user activities and system changes
//  * Retrieves log events from AWS CloudWatch Logs to track user and system activities.
//  */
// const getAuditLogs = async (logGroupName: string, logStreamName: string) => {
//   try {
//     const command = new GetLogEventsCommand({
//       logGroupName,
//       logStreamName,
//     });
//     const response = await cloudWatchLogsClient.send(command);
//     return response.events;
//   } catch (error) {
//     console.error("Error fetching audit logs:", error);
//     throw error;
//   }
// };

// /**
//  * Security Incident Logs: Evidence of monitoring for malware and other threats
//  * Retrieves security findings from AWS GuardDuty to monitor for threats such as malware and unauthorized access attempts.
//  */
// const getSecurityIncidentLogs = async (detectorId: string) => {
//   try {
//     const command = new ListFindingsCommand({
//       DetectorId: detectorId,
//       FindingCriteria: {
//         Criterion: {
//           // Add criteria to filter specific types of findings if necessary
//         },
//       },
//     });
//     const response = await guardDutyClient.send(command);
//     return response.FindingIds;
//   } catch (error) {
//     console.error("Error fetching security incident logs:", error);
//     throw error;
//   }
// };
