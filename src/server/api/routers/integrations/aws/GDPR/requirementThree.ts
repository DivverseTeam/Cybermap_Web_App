import { LookupEventsCommand } from "@aws-sdk/client-cloudtrail";
import { StartExportLabelsTaskRunCommand } from "@aws-sdk/client-glue";
import { DeleteObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
import { cloudTrailClient, glueClient, s3Client } from "../init";

// Access request logs: Retrieve CloudTrail logs to track data access requests
export const getAccessRequestLogs = async () => {
  // This function provides evidence that data access requests are processed in a timely manner.
  try {
    const data = await cloudTrailClient.send(
      new LookupEventsCommand({
        LookupAttributes: [
          { AttributeKey: "EventName", AttributeValue: "GetObject" },
        ],
        StartTime: new Date(new Date().setDate(new Date().getDate() - 30)),
        EndTime: new Date(),
      })
    );
    return data.Events;
  } catch (error) {
    console.error("Error retrieving access request logs:", error);
  }
};

// Data deletion logs: Retrieve CloudTrail logs to track data deletion events
export const getDataDeletionLogs = async () => {
  // This function provides evidence that data deletion requests are fulfilled in a timely manner.
  try {
    const data = await cloudTrailClient.send(
      new LookupEventsCommand({
        LookupAttributes: [
          { AttributeKey: "EventName", AttributeValue: "DeleteObject" },
        ],
        StartTime: new Date(new Date().setDate(new Date().getDate() - 30)), // Example: last 30 days
        EndTime: new Date(),
      })
    );
    return data.Events;
  } catch (error) {
    console.error("Error retrieving data deletion logs:", error);
  }
};

// Data export logs: Track data export events for portability requests
export const getDataExportLogs = async () => {
  // This function provides evidence that data portability requests are fulfilled.
  try {
    const data = await cloudTrailClient.send(
      new LookupEventsCommand({
        LookupAttributes: [
          {
            AttributeKey: "EventName",
            AttributeValue: "StartExportLabelsTaskRun",
          },
        ],
        StartTime: new Date(new Date().setDate(new Date().getDate() - 30)), // Example: last 30 days
        EndTime: new Date(),
      })
    );
    return data.Events;
  } catch (error) {
    console.error("Error retrieving data export logs:", error);
  }
};

// Retrieve S3 data: List objects in an S3 bucket
export const listS3Objects = async (bucketName: string) => {
  // This function is used to manage personal data stored in S3 and list objects for data access or rectification.
  try {
    const params = { Bucket: bucketName };
    const data = await s3Client.send(new ListObjectsCommand(params));
    return data.Contents;
  } catch (error) {
    console.error("Error listing S3 objects:", error);
  }
};

// Delete S3 data: Delete an object from S3
export const deleteS3Object = async (bucketName: string, objectKey: string) => {
  // This function is used to delete personal data from S3 as part of the right to erasure.
  try {
    const params = { Bucket: bucketName, Key: objectKey };
    await s3Client.send(new DeleteObjectCommand(params));
    console.log(`Deleted ${objectKey} from ${bucketName}`);
  } catch (error) {
    console.error("Error deleting S3 object:", error);
  }
};

// Export data for portability: Use AWS Glue to export data in machine-readable format
export const exportDataForPortability = async (
  s3Bucket: string,
  s3Prefix: string
) => {
  // This function exports personal data in a machine-readable format for the right to data portability.
  try {
    const data = await glueClient.send(
      new StartExportLabelsTaskRunCommand({
        TransformId: "exportLabels",
        OutputS3Path: `s3://${s3Bucket}/${s3Prefix}`,
      })
    );
    return data.TaskRunId;
  } catch (error) {
    console.error("Error starting data export for portability:", error);
  }
};
