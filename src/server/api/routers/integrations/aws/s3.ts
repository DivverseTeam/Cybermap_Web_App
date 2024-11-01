import {
  GetBucketEncryptionCommand,
  ListBucketsCommand,
} from "@aws-sdk/client-s3";
import { s3Client } from "./init";

// AWS S3 Encryption API
// Certificate management logs
// Ensure that all storage buckets are properly encrypted

async function checkBucketEncryption() {
  try {
    // List all S3 buckets in the account
    const listBucketsCommand = new ListBucketsCommand({});
    const { Buckets } = await s3Client.send(listBucketsCommand);
    if (!Buckets) return [];

    // Loop through each bucket and check its encryption settings
    const bucketEncryptionDetails = await Promise.all(
      Buckets.map(async (bucket: any) => {
        const bucketName = bucket.Name;
        try {
          // Get the encryption configuration for the bucket
          const getBucketEncryptionCommand = new GetBucketEncryptionCommand({
            Bucket: bucketName,
          });
          const encryptionConfig = await s3Client.send(
            getBucketEncryptionCommand
          );

          const kmsMasterKeyId =
            encryptionConfig?.ServerSideEncryptionConfiguration?.Rules?.[0]
              ?.ApplyServerSideEncryptionByDefault?.KMSMasterKeyID;

          return {
            BucketName: bucketName,
            EncryptionStatus: "Enabled",
            EncryptionType:
              encryptionConfig.ServerSideEncryptionConfiguration?.Rules?.map(
                (rule: any) =>
                  rule.ApplyServerSideEncryptionByDefault.SSEAlgorithm
              ).join(", "),
            KMSMasterKeyID: kmsMasterKeyId || "Not Applicable",
          };
        } catch (error: any) {
          // Handle buckets without encryption (NoSuchBucketEncryption error)
          if (error.code === "ServerSideEncryptionConfigurationNotFoundError") {
            return {
              BucketName: bucketName,
              EncryptionStatus: "Not Enabled",
              EncryptionType: "None",
              KMSMasterKeyID: "None",
            };
          } else {
            throw error;
          }
        }
      })
    );

    return bucketEncryptionDetails;
  } catch (error) {
    console.error("Error checking bucket encryption:", error);
    throw error;
  }
}
