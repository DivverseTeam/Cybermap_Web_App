import { ListRolesCommand, ListUsersCommand } from "@aws-sdk/client-iam";
import { DescribeKeyCommand } from "@aws-sdk/client-kms";
import { GetBucketEncryptionCommand } from "@aws-sdk/client-s3";
import { getAllEncryptionKeys, getAllS3Buckets } from "../common";
import { iamClient, kmsClient, s3Client } from "../init";

// Evidence: Encryption logs - Use KMS DescribeKey to retrieve encryption key details
async function getEncryptionKeyDetails() {
  try {
    // Retrieve the list of key IDs
    const keys = await getAllEncryptionKeys();

    // Check if there are any keys and get the first key
    if (keys.length > 0) {
      const firstKeyId = keys[0]?.KeyId;

      // Use the first key ID to get its details
      const describeCommand = new DescribeKeyCommand({ KeyId: firstKeyId });
      const describeResponse = await kmsClient.send(describeCommand);
      console.log("Encryption Key Details:", describeResponse);
      return describeResponse;
    } else {
      throw new Error("No keys found in the account.");
    }
  } catch (error) {
    console.error("Error retrieving encryption key details:", error);
    throw error;
  }
}

// Evidence: Encryption logs - Use S3 GetBucketEncryption to retrieve bucket encryption settings
async function getBucketEncryption() {
  try {
    const buckets = await getAllS3Buckets();
    const encryptionSettings = [];

    for (const bucket of buckets) {
      const command = new GetBucketEncryptionCommand({ Bucket: bucket.Name });
      const response = await s3Client.send(command);
      console.log(`Bucket Encryption Settings for ${bucket.Name}:`, response);
      encryptionSettings.push({
        bucketName: bucket.Name,
        encryption: response,
      });
    }
    return encryptionSettings;
  } catch (error) {
    console.error("Error retrieving bucket encryption settings:", error);
    throw error;
  }
}

// Evidence: Access control logs - Use IAM ListUsers to retrieve users with access to personal data
async function getIamUsers() {
  try {
    const command = new ListUsersCommand({});
    const response = await iamClient.send(command);
    console.log("IAM Users:", response.Users);
    return response.Users;
  } catch (error) {
    console.error("Error retrieving IAM users:", error);
    throw error;
  }
}

// Evidence: Access control logs - Use IAM ListRoles to retrieve roles with access to personal data
async function getIamRoles() {
  try {
    const command = new ListRolesCommand({});
    const response = await iamClient.send(command);
    console.log("IAM Roles:", response.Roles);
    return response.Roles;
  } catch (error) {
    console.error("Error retrieving IAM roles:", error);
    throw error;
  }
}

// Evidence: Audit logs - Placeholder function for retrieving continuous monitoring or data integrity logs
// (Implementation depends on the AWS service or logging mechanism used for monitoring data integrity)
async function getAuditLogs() {
  try {
    // Replace this with the actual service call or log retrieval method
    console.log(
      "Fetching audit logs for continuous monitoring of data integrity..."
    );
    // Placeholder for response
    const response = {}; // Replace with actual logs
    return response;
  } catch (error) {
    console.error("Error retrieving audit logs:", error);
    throw error;
  }
}

async function getDataSecurityAndIntegrityEvidence() {
  try {
    const encryptionKeyDetails = await getEncryptionKeyDetails();
    const bucketEncryptionSettings = await getBucketEncryption();
    const iamUsers = await getIamUsers();
    const iamRoles = await getIamRoles();
    const auditLogs = await getAuditLogs();

    return {
      encryptionKeyDetails,
      bucketEncryptionSettings,
      iamUsers,
      iamRoles,
      auditLogs,
    };
  } catch (error) {
    console.error(
      "Error retrieving data security and integrity evidence:",
      error
    );
    throw error;
  }
}

export { getDataSecurityAndIntegrityEvidence };
