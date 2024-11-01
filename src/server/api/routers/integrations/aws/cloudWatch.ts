import {
  DescribeAlarmsCommand,
  GetMetricDataCommand,
} from "@aws-sdk/client-cloudwatch";
import { FilterLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";
import { GetComplianceDetailsByResourceCommand } from "@aws-sdk/client-config-service";
import {
  cloudWatchClient,
  configServiceClient,
  cloudWatchLogsClient,
} from "./init";

// Incident reports: Logs that detail security incidents and the responses taken.
// Alert configurations: Proof of alerts set for security breaches, resource overloads, or downtime.

/**
 * Retrieves all CloudWatch alarms for resource overload alerts.
 */
async function getAllAlarms() {
  try {
    const params = {};
    const describeAlarmsCommand = new DescribeAlarmsCommand(params);
    const alarms = await cloudWatchClient.send(describeAlarmsCommand);
    console.log("Alarms:", alarms.MetricAlarms);
    return alarms.MetricAlarms;
  } catch (error) {
    console.error("Error fetching alarms:", error);
  }
}

// Monitoring system configurations: Evidence of continuous monitoring in place for critical infrastructure.
// Function to get CloudWatch metric status for critical infrastructure monitoring
async function getCloudWatchMetrics(
  metricName: any,
  namespace: any,
  startTime: any,
  endTime: any,
  period: any
) {
  try {
    const params = {
      StartTime: startTime,
      EndTime: endTime,
      MetricDataQueries: [
        {
          Id: "monitoringMetric",
          MetricStat: {
            Metric: {
              Namespace: namespace,
              MetricName: metricName,
            },
            Period: period,
            Stat: "Average",
          },
          ReturnData: true,
        },
      ],
    };
    const getMetricDataCommand = new GetMetricDataCommand(params);
    const metricData = await cloudWatchClient.send(getMetricDataCommand);
    console.log("Metric Data:", metricData.MetricDataResults);
    return metricData.MetricDataResults;
  } catch (error) {
    console.error("Error fetching CloudWatch metric data:", error);
  }
}

// // Example usage
// (async () => {
//   // Fetch all alarms
//   await getAllAlarms();

//   // Fetch metric data (adjust parameters as needed)
//   const metricName = 'CPUUtilization';
//   const namespace = 'AWS/EC2';
//   const startTime = new Date(new Date().getTime() - 60 * 60 * 1000); // 1 hour ago
//   const endTime = new Date();
//   const period = 300; // 5 minutes
//   await getMetricData(metricName, namespace, startTime, endTime, period);
// })();

// Incident reports: Logs that detail security incidents and the responses taken.
// Function to get logs from CloudWatch-Logs by filtering with a specific keyword (e.g., "ERROR", "incident")
async function getCloudWatchIncidentLogs(
  logGroupName: any,
  startTime: any,
  endTime: any,
  filterPattern: any
) {
  try {
    const params = {
      logGroupName,
      startTime,
      endTime,
      filterPattern, // Example: "ERROR" or "incident"
    };
    const filterLogEventsCommand = new FilterLogEventsCommand(params);
    const logs = await cloudWatchLogsClient.send(filterLogEventsCommand);
    console.log("CloudWatch Logs:", logs.events);
    return logs.events;
  } catch (error) {
    console.error("Error fetching CloudWatch logs:", error);
  }
}

// // Example usage
// (async () => {
//   // Set parameters
//   const logGroupName = '/aws/lambda/myLambdaFunction'; // Replace with your log group name
//   const startTime = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).getTime(); // 24 hours ago
//   const endTime = new Date().getTime();
//   const filterPattern = 'ERROR'; // Customize based on your incident keywords
//   const eventType = 'UnauthorizedAccess'; // Customize for specific incident events

//   // Fetch incident logs from CloudWatch
//   const cloudWatchLogs = await getCloudWatchIncidentLogs(logGroupName, startTime, endTime, filterPattern);

//   // Fetch incident events from CloudTrail
//   const cloudTrailEvents = await getCloudTrailEvents(startTime, endTime, eventType);
// })();

// Monitoring system configurations: Evidence of continuous monitoring in place for critical infrastructure.
// Function to get compliance status of critical resources from AWS Config

async function getConfigCompliance(resourceType: any, resourceId: any) {
  try {
    const params = {
      NextToken: "",
    };
    const getComplianceDetailsByResourceCommand =
      new GetComplianceDetailsByResourceCommand({
        ResourceType: resourceType,
        ResourceId: resourceId,
        ComplianceTypes: [
          "COMPLIANT",
          "NON_COMPLIANT",
          "NOT_APPLICABLE",
          "INSUFFICIENT_DATA",
        ],
        ...params,
      });
    const compliance = await configServiceClient.send(
      getComplianceDetailsByResourceCommand
    );
    console.log("Config Compliance:", compliance.EvaluationResults);
    return compliance.EvaluationResults;
  } catch (error) {
    console.error("Error fetching config compliance:", error);
  }
}

// // Example usage
// (async () => {
//   // AWS Config compliance check (e.g., for EC2 instance)
//   const resourceType = 'AWS::EC2::Instance';
//   const resourceId = 'i-0abcdef1234567890'; // Replace with actual resource ID
//   await getConfigCompliance(resourceType, resourceId);

//   // CloudWatch metrics check (e.g., CPU utilization for EC2 instances)
//   const metricName = 'CPUUtilization';
//   const namespace = 'AWS/EC2';
//   const startTime = new Date(new Date().getTime() - 60 * 60 * 1000); // 1 hour ago
//   const endTime = new Date();
//   const period = 300; // 5 minutes
//   await getCloudWatchMetrics(metricName, namespace, startTime, endTime, period);
// })();
