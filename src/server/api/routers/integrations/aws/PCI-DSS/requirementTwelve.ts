// Maintain a policy that addresses information security for all personnel

import { LookupEventsCommand } from "@aws-sdk/client-cloudtrail";
import { ListRolesCommand } from "@aws-sdk/client-iam";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { cloudTrailClient, iamClient, s3Client } from "../init";

// Retrieve security policy document from S3 bucket
// Assuming you store security policy documentation in a specific S3 bucket or another documentation platform
async function getSecurityPolicyDocumentation(
  bucketName: string,
  policyKey: string
) {
  try {
    const params = {
      Bucket: bucketName,
      Key: policyKey,
    };
    const command = new GetObjectCommand(params);
    const data = await s3Client.send(command);
    if (!data.Body) {
      return null;
    }
    // return data.Body.toString("utf-8");
    return data.Body;
  } catch (error) {
    console.error("Error fetching security policy documentation:", error);
    throw error;
  }
}

// const dynamoDB = new AWS.DynamoDB.DocumentClient();
// Retrieve user training logs for users handling cardholder data. Assuming training logs are stored in DynamoDB:
// async function getUserTrainingLogs(tableName) {
//   try {
//     const params = {
//       TableName: tableName,
//     };
//     const data = await dynamoDB.scan(params).promise();
//     return data.Items;
//   } catch (error) {
//     console.error("Error fetching user training logs:", error);
//     throw error;
//   }
// }

// List all IAM roles and associated policies
async function listIAMRoles() {
  try {
    const command = new ListRolesCommand({});
    const data = await iamClient.send(command);
    return data.Roles;
  } catch (error) {
    console.error("Error listing IAM roles:", error);
    throw error;
  }
}

// Lookup events in CloudTrail to track user activities
async function lookupCloudTrailEvents(startTime: Date, endTime: Date) {
  try {
    const params = {
      StartTime: startTime,
      EndTime: endTime,
      MaxResults: 50,
    };
    const command = new LookupEventsCommand(params);
    const data = await cloudTrailClient.send(command);
    return data.Events;
  } catch (error) {
    console.error("Error looking up CloudTrail events:", error);
    throw error;
  }
}

export async function getEvidence() {
  // Get security policy document
  const policy = await getSecurityPolicyDocumentation(
    "my-bucket",
    "security-policy.docx"
  );
  console.log("Security Policy:", policy);

  // // Get user training logs
  // const trainingLogs = await getUserTrainingLogs("TrainingLogsTable");
  // console.log("User Training Logs:", trainingLogs);

  // List IAM roles
  const roles = await listIAMRoles();
  console.log("IAM Roles:", roles);

  // Lookup CloudTrail events in the last 24 hours
  const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
  const endTime = new Date();
  const events = await lookupCloudTrailEvents(startTime, endTime);
  console.log("CloudTrail Events:", events);
  return {
    policy,
    // trainingLogs,
    roles,
    events,
  };
}
