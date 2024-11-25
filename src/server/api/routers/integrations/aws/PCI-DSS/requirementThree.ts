// Protect stored cardholder data

import { GetBucketEncryptionCommand } from "@aws-sdk/client-s3";
import { kmsClient, rdsClient, s3Client } from "../init";
import { DescribeKeyCommand, ListKeysCommand } from "@aws-sdk/client-kms";
import { DescribeDBInstancesCommand } from "@aws-sdk/client-rds"; 

// Encryption Policies: S3 Bucket Encryption
async function getBucketEncryption(bucketName: string) {
  try {
    const command = new GetBucketEncryptionCommand({ Bucket: bucketName });
    const response = await s3Client.send(command);
    console.log("Bucket Encryption:", response);
    return response;
  } catch (error) {
    console.error("Error fetching bucket encryption:", error);
    throw error;
  }
}

async function listKeys() {
  try {
    const command = new ListKeysCommand({});
    const response = await kmsClient.send(command);
    return response.Keys;
  } catch (error) {
    console.error("Error listing KMS keys:", error);
    throw error;
  }
}

async function describeKey(keyId: string) {
  try {
    const command = new DescribeKeyCommand({ KeyId: keyId });
    const response = await kmsClient.send(command);
    console.log(`Key Description for ${keyId}:`, response);
    return response;
  } catch (error) {
    console.error(`Error describing key ${keyId}:`, error);
    throw error;
  }
}

// Encryption Key Management: AWS KMS Key Details
async function getAllKeyDetails() {
  const keys = await listKeys();
  if (!keys) return;
  for (const key of keys) {
    await describeKey(key?.KeyId || '');
  }
}

// Data Storage Logs: RDS Encryption Settings
async function describeDBInstances() {
  try {
    const command = new DescribeDBInstancesCommand({});
    const response = await rdsClient.send(command);
    if (!response.DBInstances) return [];
    const encryptedInstances = response.DBInstances.map((instance) => ({
      DBInstanceIdentifier: instance.DBInstanceIdentifier,
      StorageEncrypted: instance.StorageEncrypted,
      KmsKeyId: instance.KmsKeyId,
    }));
    console.log("DB Instances Encryption:", encryptedInstances);
    return encryptedInstances;
  } catch (error) {
    console.error("Error describing DB instances:", error);
    throw error;
  }
}

export async function getEvidence() {
  const bucketEncryption = await getBucketEncryption("example-bucket");
  const keyDetails = await getAllKeyDetails();
  const dbInstances = await describeDBInstances();

  return {
    bucketEncryption,
    keyDetails,
    dbInstances,
  };
}