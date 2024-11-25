// import {
//   DescribeRuleCommand,
//   PutRuleCommand,
// } from "@aws-sdk/client-cloudwatch-events";
// import { ListFindingsCommand } from "@aws-sdk/client-securityhub";
// import { cloudWatchEventsClient, securityHubClient } from "../init";

// // Incident logs: Documentation of detected security incidents and how they were handled
// export const getIncidentLogs = async () => {
//   try {
//     const command = new ListFindingsCommand({
//       // Customize filters as needed to retrieve specific security incident findings
//       Filters: {
//         ProductArn: [
//           {
//             Comparison: "EQUALS",
//             Value: "arn:aws:securityhub:us-east-1::product/aws/securityhub",
//           },
//         ],
//         RecordState: [{ Comparison: "EQUALS", Value: "ACTIVE" }],
//       },
//     });
//     const response = await securityHubClient.send(command);
//     console.log("Incident Logs:", response.Findings);
//     return response.Findings;
//   } catch (error) {
//     console.error("Error retrieving incident logs:", error);
//     throw error;
//   }
// };

// // Response plan logs: Proof that incident response procedures were followed
// export const getResponsePlanLogs = async () => {
//   try {
//     const command = new ListFindingsCommand({
//       // Customize filters to identify findings that required response actions
//       Filters: {
//         ComplianceStatus: [{ Comparison: "EQUALS", Value: "FAILED" }],
//       },
//     });
//     const response = await securityHubClient.send(command);
//     console.log("Response Plan Logs:", response.Findings);
//     return response.Findings;
//   } catch (error) {
//     console.error("Error retrieving response plan logs:", error);
//     throw error;
//   }
// };

// // PutRule: Use CloudWatch Events to create a rule to detect incidents
// export const createCloudWatchEventRule = async (
//   ruleName: string,
//   eventPattern: string
// ) => {
//   try {
//     const command = new PutRuleCommand({
//       Name: ruleName,
//       EventPattern: JSON.stringify(eventPattern),
//       State: "ENABLED",
//     });
//     const response = await cloudWatchEventsClient.send(command);
//     console.log("CloudWatch Event Rule Created:", response.RuleArn);
//     return response.RuleArn;
//   } catch (error) {
//     console.error("Error creating CloudWatch Event rule:", error);
//     throw error;
//   }
// };

// // DescribeRule: Retrieve details of a specific CloudWatch Event rule for documentation purposes
// export const getCloudWatchEventRuleDetails = async (ruleName: string) => {
//   try {
//     const command = new DescribeRuleCommand({ Name: ruleName });
//     const response = await cloudWatchEventsClient.send(command);
//     console.log("CloudWatch Event Rule Details:", response);
//     return response;
//   } catch (error) {
//     console.error("Error retrieving CloudWatch Event rule details:", error);
//     throw error;
//   }
// };
