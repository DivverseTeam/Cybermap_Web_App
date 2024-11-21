import { DescribeKeyCommand, ListKeysCommand } from "@aws-sdk/client-kms";
import { GetBucketEncryptionCommand } from "@aws-sdk/client-s3";
import { kmsClient, s3Client } from "../init";

/**
 * Evidence: Key management logs - Documentation of key generation, use, and destruction.
 * Function to list all KMS keys.
 * This shows available keys used for encryption.
 */
const listKMSKeys = async () => {
  try {
    const command = new ListKeysCommand({});
    const response = await kmsClient.send(command);
    return response.Keys; // Returns a list of KMS keys
  } catch (error) {
    console.error("Error listing KMS keys:", error);
    throw error;
  }
};

/**
 * Evidence: Key management logs - Documentation of key generation, use, and destruction.
 * Function to describe a KMS key by its KeyId.
 * This provides information on the specified key's usage.
 * @param {string} keyId - The ID of the KMS key to describe.
 */
const describeKMSKey = async (keyId: string) => {
  try {
    const command = new DescribeKeyCommand({ KeyId: keyId });
    const response = await kmsClient.send(command);
    return response.KeyMetadata; // Returns details about the specified KMS key
  } catch (error) {
    console.error("Error describing KMS key:", error);
    throw error;
  }
};

/**
 * Evidence: Encryption logs - Proof that sensitive data is encrypted in line with policy.
 * Function to get encryption settings for an S3 bucket.
 * This verifies that sensitive data in the bucket is encrypted at rest.
 * @param {string} bucketName - The name of the S3 bucket.
 */
const getBucketEncryption = async (bucketName: string) => {
  try {
    const command = new GetBucketEncryptionCommand({ Bucket: bucketName });
    const response = await s3Client.send(command);
    return response.ServerSideEncryptionConfiguration;
  } catch (error: any) {
    if (error.name === "ServerSideEncryptionConfigurationNotFoundError") {
      console.warn("No encryption configuration found for bucket:", bucketName);
      return null;
    }
    console.error("Error getting bucket encryption:", error);
    throw error;
  }
};
