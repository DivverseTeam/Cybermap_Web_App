// Requirement 10: Track and monitor all access to network resources and cardholder data

import { LookupEventsCommand } from "@aws-sdk/client-cloudtrail";
import {
  DescribeLogGroupsCommand,
  FilterLogEventsCommand,
} from "@aws-sdk/client-cloudwatch-logs";
import { cloudTrailClient, cloudWatchLogsClient } from "../init";

// Access Logs - Using CloudTrail's LookupEvents
async function getAccessLogs(startTime: Date, endTime: Date) {
  try {
    const params = {
      StartTime: startTime,
      EndTime: endTime,
      MaxResults: 50, // Adjust as needed
    };
    const command = new LookupEventsCommand(params);
    const data = await cloudTrailClient.send(command);
    console.log("Access Logs:", data.Events);
    return data.Events;
  } catch (error) {
    console.error("Error retrieving access logs:", error);
    throw error;
  }
}

// Log Retention Policies - Using CloudWatch Logs
async function getLogRetentionPolicy(logGroupName: string) {
  try {
    const command = new DescribeLogGroupsCommand({
      logGroupNamePrefix: logGroupName,
    });
    const data = await cloudWatchLogsClient.send(command);
    if (!data.logGroups) {
      return null;
    }
    const logGroup = data.logGroups.find(
      (group) => group.logGroupName === logGroupName
    );
    if (
      logGroup &&
      logGroup.retentionInDays &&
      logGroup.retentionInDays >= 365
    ) {
      console.log(`Log retention policy: ${logGroup.retentionInDays} days`);
      return logGroup.retentionInDays;
    } else {
      throw new Error(
        "Log retention policy does not meet the 1-year requirement."
      );
    }
  } catch (error) {
    console.error("Error retrieving log retention policy:", error);
    throw error;
  }
}

// Log Review Reports - Using CloudWatch Logs FilterLogEvents
async function getLogReviewReports(
  logGroupNamePrefix: string,
  filterPattern: string,
  startTime: Date,
  endTime: Date
) {
  try {
    const params = {
      logGroupNamePrefix,
      filterPattern,
      startTime: startTime.getTime(),
      endTime: endTime.getTime(),
      limit: 50, // Adjust as needed
    };
    const command = new FilterLogEventsCommand(params);
    const data = await cloudWatchLogsClient.send(command);
    console.log("Log Review Reports:", data.events);
    return data.events;
  } catch (error) {
    console.error("Error retrieving log review reports:", error);
    throw error;
  }
}

export async function getEvidence() {
  const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
  const endTime = new Date();

  // Access Logs
  await getAccessLogs(startTime, endTime);

  // Log Retention Policy
  const logGroupName = "your-log-group-name";
  await getLogRetentionPolicy(logGroupName);

  // Log Review Reports
  const filterPattern = '{ $.eventName = "DescribeInstances" }'; // Example pattern
  await getLogReviewReports(logGroupName, filterPattern, startTime, endTime);
}
