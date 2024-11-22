// // Monitoring and Incident Response (Security, Availability)

// import {
//   LookupAttribute,
//   LookupEventsCommand,
// } from "@aws-sdk/client-cloudtrail";
// import {
//   DescribeAlarmsCommand,
//   GetMetricDataCommand,
// } from "@aws-sdk/client-cloudwatch";
// import { FilterLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";
// import { GetComplianceDetailsByResourceCommand } from "@aws-sdk/client-config-service";
// import {
//   GetFindingsCommand,
//   ListFindingsCommand,
// } from "@aws-sdk/client-guardduty";
// import { DescribeEventsCommand } from "@aws-sdk/client-health";
// import {
//   cloudTrailClient,
//   cloudWatchClient,
//   cloudWatchLogsClient,
//   configServiceClient,
//   guardDutyClient,
//   healthClient,
// } from "../init";

// // Incident reports: Logs that detail security incidents and the responses taken.
// // Function to get CloudTrail events indicating potential incidents
// async function getCloudTrailEvents({
//   lookupAttributes,
//   startTime,
//   endTime,
//   maxResults,
// }: {
//   startTime: Date;
//   endTime: Date;
//   lookupAttributes: LookupAttribute[];
//   maxResults: number;
// }) {
//   try {
//     const lookupEventsCommand = new LookupEventsCommand({
//       LookupAttributes: lookupAttributes,
//       StartTime: startTime, // Last 24 hours
//       EndTime: endTime,
//       MaxResults: maxResults,
//     });
//     const events = await cloudTrailClient.send(lookupEventsCommand);
//     console.log("CloudTrail Events:", events.Events);
//     return { events: events.Events, nextToken: events.NextToken };
//   } catch (error) {
//     console.error("Error fetching CloudTrail events:", error);
//   }
// }

// // Incident reports: Logs that detail security incidents and the responses taken.
// // Alert configurations: Proof of alerts set for security breaches, resource overloads, or downtime.
// async function getAllAlarms() {
//   try {
//     const params = {};
//     const describeAlarmsCommand = new DescribeAlarmsCommand(params);
//     const alarms = await cloudWatchClient.send(describeAlarmsCommand);
//     console.log("Alarms:", alarms.MetricAlarms);
//     return alarms.MetricAlarms;
//   } catch (error) {
//     console.error("Error fetching alarms:", error);
//   }
// }

// // Incident reports: Logs that detail security incidents and the responses taken.
// // Function to get logs from CloudWatch-Logs by filtering with a specific keyword (e.g., "ERROR", "incident")
// async function getCloudWatchIncidentLogs(
//   logGroupName: any,
//   startTime: any,
//   endTime: any,
//   filterPattern: any
// ) {
//   try {
//     const params = {
//       logGroupName,
//       startTime,
//       endTime,
//       filterPattern, // Example: "ERROR" or "incident"
//     };
//     const filterLogEventsCommand = new FilterLogEventsCommand(params);
//     const logs = await cloudWatchLogsClient.send(filterLogEventsCommand);
//     console.log("CloudWatch Logs:", logs.events);
//     return logs.events;
//   } catch (error) {
//     console.error("Error fetching CloudWatch logs:", error);
//   }
// }

// // Monitoring system configurations: Evidence of continuous monitoring in place for critical infrastructure.
// // Alert configurations: Proof of alerts set for security breaches, resource overloads, or downtime.
// async function getAllFindings(detectorId: any) {
//   try {
//     // Step 1: List all finding IDs
//     const listFindingsParams = { DetectorId: detectorId };
//     const listFindingsCommand = new ListFindingsCommand(listFindingsParams);
//     const listFindingsResponse = await guardDutyClient.send(
//       listFindingsCommand
//     );
//     const findingIds = listFindingsResponse.FindingIds;

//     if (!findingIds?.length) {
//       console.log("No findings found.");
//       return;
//     }

//     // Step 2: Get detailed findings information
//     const getFindingsParams = {
//       DetectorId: detectorId,
//       FindingIds: findingIds,
//     };
//     const getFindingsCommand = new GetFindingsCommand(getFindingsParams);
//     const getFindingsResponse = await guardDutyClient.send(getFindingsCommand);

//     // Output findings
//     console.log(
//       "Findings:",
//       JSON.stringify(getFindingsResponse.Findings, null, 2)
//     );
//   } catch (error) {
//     console.error("Error retrieving GuardDuty findings:", error);
//   }
// }

// // Monitoring system configurations: Evidence of continuous monitoring in place for critical infrastructure.
// // Function to get compliance status of critical resources from AWS Config
// async function getConfigCompliance(resourceType: any, resourceId: any) {
//   try {
//     const params = {
//       NextToken: "",
//     };
//     const getComplianceDetailsByResourceCommand =
//       new GetComplianceDetailsByResourceCommand({
//         ResourceType: resourceType,
//         ResourceId: resourceId,
//         ComplianceTypes: [
//           "COMPLIANT",
//           "NON_COMPLIANT",
//           "NOT_APPLICABLE",
//           "INSUFFICIENT_DATA",
//         ],
//         ...params,
//       });
//     const compliance = await configServiceClient.send(
//       getComplianceDetailsByResourceCommand
//     );
//     console.log("Config Compliance:", compliance.EvaluationResults);
//     return compliance.EvaluationResults;
//   } catch (error) {
//     console.error("Error fetching config compliance:", error);
//   }
// }

// // Alert configurations: Proof of alerts set for security breaches, resource overloads, or downtime.
// async function getHealthEvents() {
//   try {
//     const describeEventsCommand = new DescribeEventsCommand({});
//     const describeEventsResponse = await healthClient.send(
//       describeEventsCommand
//     );
//     console.log(
//       "AWS Health Events:",
//       JSON.stringify(describeEventsResponse.events, null, 2)
//     );
//   } catch (error) {
//     console.error("Error retrieving AWS Health events:", error);
//   }
// }

// // Function to get metric data for a specific metric over a given period
// async function getMetricData(
//   metricName = "CPUUtilization",
//   namespace = "AWS/EC2",
//   startTime = new Date(), // new Date(new Date() - 24 * 60 * 60 * 1000) 24 hours ago,
//   endTime = new Date(),
//   period = 300 // 5 minutes,
// ) {
//   try {
//     const params = {
//       StartTime: startTime, // Date object or ISO string
//       EndTime: endTime, // Date object or ISO string
//       MetricDataQueries: [
//         {
//           Id: "m1",
//           MetricStat: {
//             Metric: {
//               Namespace: namespace,
//               MetricName: metricName,
//             },
//             Period: period, // in seconds (e.g., 300 for 5 minutes)
//             Stat: "Average", // Aggregation statistic (e.g., 'Average', 'Sum', 'Minimum', 'Maximum')
//           },
//         },
//       ],
//     };

//     // Get Metric Data
//     const getMetricDataCommand = new GetMetricDataCommand(params);
//     const metricData = await cloudWatchClient.send(getMetricDataCommand);
//     return metricData.MetricDataResults;
//   } catch (error) {
//     console.error("Error fetching metric data:", error);
//     throw error;
//   }
// }
