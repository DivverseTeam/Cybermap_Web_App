import {
  ListUsersCommand,
  ListAccessKeysCommand,
  GetUserCommand,
  ListMFADevicesCommand,
} from "@aws-sdk/client-iam";
import {
  LookupEventsCommand,
} from "@aws-sdk/client-cloudtrail";
import {
  DescribeLogGroupsCommand,
  FilterLogEventsCommand,
} from "@aws-sdk/client-cloudwatch-logs";
import {
  PutMetricDataCommand,
} from "@aws-sdk/client-cloudwatch";
import {
  GetObjectCommand,
  ListObjectVersionsCommand,
} from "@aws-sdk/client-s3";

import {
    acmClient,
  cloudTrailClient,
  cloudWatchClient,
  cloudWatchLogsClient,
  elbV2Client,
  iamClient,
  s3Client,
} from "../init";
import { ListCertificatesCommand } from "@aws-sdk/client-acm";
import { DescribeLoadBalancersCommand } from "@aws-sdk/client-elastic-load-balancing-v2";

// Unique user identification: Ensure every user accessing systems has a unique ID.
/**
 * Retrieve the list of all users.
 */
export async function listAllUsers() {
  try {
    const command = new ListUsersCommand({});
    const response = await iamClient.send(command);
    return response.Users;
  } catch (error) {
    console.error("Error listing users:", error);
    throw error;
  }
}
// Unique user identification: Ensure every user accessing systems has a unique ID.
/**
 * Retrieve access keys for a specific user.
 */
export async function listUserAccessKeys(userName: string) {
  try {
    const command = new ListAccessKeysCommand({ UserName: userName });
    const response = await iamClient.send(command);
    return response.AccessKeyMetadata;
  } catch (error) {
    console.error(`Error listing access keys for user ${userName}:`, error);
    throw error;
  }
}

// Unique user identification: Ensure every user accessing systems has a unique ID.
/**
 * Retrieve details of a specific user.
 */
export async function getUserDetails(userName: string) {
  try {
    const command = new GetUserCommand({ UserName: userName });
    const response = await iamClient.send(command);
    return response.User;
  } catch (error) {
    console.error(`Error retrieving details for user ${userName}:`, error);
    throw error;
  }
}

// MFA enforcement: Ensure multi-factor authentication (MFA) is required for accessing systems with PHI
/**
 * List MFA devices for a specific user.
 */
export async function listUserMFADevices(userName: string) {
  try {
    const command = new ListMFADevicesCommand({ UserName: userName });
    const response = await iamClient.send(command);
    return response.MFADevices;
  } catch (error) {
    console.error(`Error listing MFA devices for user ${userName}:`, error);
    throw error;
  }
}

/**
 * Main function to fetch evidence for access control and MFA enforcement.
 */
// export async function getEvidence() {
//   try {
//     const users = await listAllUsers();

//     for (const user of users) {
//       console.log(`User: ${user.UserName}`);

//       const accessKeys = await listUserAccessKeys(user.UserName);
//       console.log(`Access Keys for ${user.UserName}:`, accessKeys);

//       const userDetails = await getUserDetails(user.UserName);
//       console.log(`Details for ${user.UserName}:`, userDetails);

//       const mfaDevices = await listUserMFADevices(user.UserName);
//       console.log(`MFA Devices for ${user.UserName}:`, mfaDevices);
//     }
//   } catch (error) {
//     console.error("Error fetching evidence:", error);
//   }
// }

// Access logs: Logs showing access to PHI systems and any changes.
const getAccessLogs = async (startTime: Date, endTime: Date) => {
  try {
    const command = new LookupEventsCommand({
      StartTime: new Date(startTime),
      EndTime: new Date(endTime),
    });
    const response = await cloudTrailClient.send(command);
    return response.Events;
  } catch (error) {
    console.error("Error retrieving access logs:", error);
    throw error;
  }
};

// Audit logs: Ensure logs are maintained for all access and changes to systems handling PHI.
const getFilteredLogs = async (
  logGroupName: string,
  filterPattern: string,
  startTime: string,
  endTime: string
) => {
  try {
    const command = new FilterLogEventsCommand({
      logGroupName,
      filterPattern,
      startTime: new Date(startTime).getTime(),
      endTime: new Date(endTime).getTime(),
    });
    const response = await cloudWatchLogsClient.send(command);
    return response.events;
  } catch (error) {
    console.error("Error retrieving filtered logs:", error);
    throw error;
  }
};

// Example usage:
// getFilteredLogs("/aws/lambda/my-log-group", "{ $.eventType = \"Update\" }", "2024-01-01T00:00:00Z", "2024-01-31T23:59:59Z").then(console.log);
// Log retention policies: Proof that logs are retained for an appropriate period and regularly
const getLogRetentionPolicies = async () => {
  try {
    const command = new DescribeLogGroupsCommand({});
    const response = await cloudWatchLogsClient.send(command);
    if (!response.logGroups) return [];
    return response.logGroups.map((logGroup) => ({
      logGroupName: logGroup.logGroupName,
      retentionInDays: logGroup.retentionInDays,
    }));
  } catch (error) {
    console.error("Error retrieving log retention policies:", error);
    throw error;
  }
};

// Function to send integrity metrics to CloudWatch
// Evidence: Data integrity logs (via CloudWatch Logs API: PutMetricData)
export async function sendDataIntegrityMetrics(
  metricName: string,
  namespace: string,
//   value: string
) {
  const command = new PutMetricDataCommand({
    Namespace: namespace,
    MetricData: [
      {
        MetricName: metricName,
        // Value: value,
        Timestamp: new Date(),
      },
    ],
  });

  try {
    const response = await cloudWatchClient.send(command);
    console.log("Metric data sent successfully:", response);
  } catch (error) {
    console.error("Error sending metric data:", error);
  }
}

// Function to retrieve the versioning history of an object in S3
// Evidence: Configuration logs (via AWS S3 API: GetObjectVersion)
export async function getObjectVersionHistory(
  bucketName: string,
  objectKey: string
) {
  const command = new ListObjectVersionsCommand({
    Bucket: bucketName,
    Prefix: objectKey,
  });

  try {
    const response = await s3Client.send(command);
    console.log("Object version history retrieved:", response);
    return response.Versions;
  } catch (error) {
    console.error("Error retrieving object version history:", error);
  }
}

// Function to get a specific version of an object from S3
// Evidence: Configuration logs (via AWS S3 API: GetObjectVersion)
export async function getObjectVersion(
  bucketName: string,
  objectKey: string,
  versionId: string
) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    VersionId: versionId,
  });

  try {
    const response = await s3Client.send(command);
    console.log("Specific object version retrieved:", response);
    return response.Body;
  } catch (error) {
    console.error("Error retrieving object version:", error);
  }
}


/**
 * Evidence: TLS certificates
 * Use this function to list all SSL/TLS certificates in AWS Certificate Manager (ACM).
 * Purpose: Validate that public-facing services transmitting PHI have valid SSL/TLS certificates.
 */
async function listTLSCertificates() {
  try {
    const command = new ListCertificatesCommand({});
    const response = await acmClient.send(command);
    return response.CertificateSummaryList; // Lists certificate ARNs and domain names
  } catch (error) {
    console.error("Error listing TLS certificates:", error);
    throw error;
  }
}

/**
 * Evidence: Load balancer SSL/TLS enforcement
 * Use this function to retrieve details about load balancers.
 * Purpose: Ensure SSL/TLS is enforced for all traffic routed through load balancers.
 */
async function describeLoadBalancers() {
  try {
    const command = new DescribeLoadBalancersCommand({});
    const response = await elbV2Client.send(command);
    return response.LoadBalancers; // Lists load balancers with details such as scheme and SSL/TLS settings
  } catch (error) {
    console.error("Error describing load balancers:", error);
    throw error;
  }
}