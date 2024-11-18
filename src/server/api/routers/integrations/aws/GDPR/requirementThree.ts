// Data Subject Rights (Articles 12-23)

import { LookupEventsCommand } from "@aws-sdk/client-cloudtrail";
import { StartExportLabelsTaskRunCommand } from "@aws-sdk/client-glue";
import { DeleteObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
import { TIME_FRAME } from "../constants";
import { cloudTrailClient, glueClient, s3Client } from "../init";

// This function provides evidence that data access requests are processed in a timely manner.
// Access request logs: Retrieve CloudTrail logs to track data access requests
const getAccessRequestLogs = async () => {
  try {
    const data = await cloudTrailClient.send(
      new LookupEventsCommand({
        LookupAttributes: [
          { AttributeKey: "EventName", AttributeValue: "GetObject" },
        ],
        StartTime: TIME_FRAME.START,
        EndTime: TIME_FRAME.END,
      })
    );
    return data.Events;
  } catch (error) {
    console.error("Error retrieving access request logs:", error);
  }
};

// This function provides evidence that data deletion requests are fulfilled in a timely manner.
// Data deletion logs: Retrieve CloudTrail logs to track data deletion events
const getDataDeletionLogs = async () => {
  try {
    const data = await cloudTrailClient.send(
      new LookupEventsCommand({
        LookupAttributes: [
          { AttributeKey: "EventName", AttributeValue: "DeleteObject" },
        ],
        StartTime: TIME_FRAME.START,
        EndTime: TIME_FRAME.END,
      })
    );
    return data.Events;
  } catch (error) {
    console.error("Error retrieving data deletion logs:", error);
  }
};

// Data export logs: Track data export events for portability requests
const getDataExportLogs = async () => {
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
        StartTime: TIME_FRAME.START,
        EndTime: TIME_FRAME.END,
      })
    );
    return data.Events;
  } catch (error) {
    console.error("Error retrieving data export logs:", error);
  }
};

// This function is used to manage personal data stored in S3 and list objects for data access or rectification.
// Retrieve S3 data: List objects in an S3 bucket
const listS3Objects = async (bucketName: string) => {
  try {
    const params = { Bucket: bucketName };
    const data = await s3Client.send(new ListObjectsCommand(params));
    return data.Contents;
  } catch (error) {
    console.error("Error listing S3 objects:", error);
  }
};

// This function is used to delete personal data from S3 as part of the right to erasure.
// Delete S3 data: Delete an object from S3
const deleteS3Object = async (bucketName: string, objectKey: string) => {
  try {
    const params = { Bucket: bucketName, Key: objectKey };
    await s3Client.send(new DeleteObjectCommand(params));
    console.log(`Deleted ${objectKey} from ${bucketName}`);
  } catch (error) {
    console.error("Error deleting S3 object:", error);
  }
};

// This function exports personal data in a machine-readable format for the right to data portability.
// Export data for portability: Use AWS Glue to export data in machine-readable format
const exportDataForPortability = async (
  s3Bucket: string,
  s3Prefix: string
) => {
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

// not completed
async function getDataSubjectRightsEvidence() {
  const accessRequestLogs = await getAccessRequestLogs();
  const dataDeletionLogs = await getDataDeletionLogs();
  const dataExportLogs = await getDataExportLogs();
  const s3Objects = await listS3Objects("my-bucket");
  // const s3ObjectKey = s3Objects[0].Key;
  // await deleteS3Object("my-bucket", s3ObjectKey);
  const taskRunId = await exportDataForPortability("my-bucket", "exports");
  return { accessRequestLogs, dataDeletionLogs, dataExportLogs, taskRunId };
}

export { getDataSubjectRightsEvidence };