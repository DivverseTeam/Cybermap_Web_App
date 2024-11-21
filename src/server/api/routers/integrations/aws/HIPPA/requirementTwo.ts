import {
  LookupEventsCommand,
} from "@aws-sdk/client-cloudtrail";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import {
  ListBackupPlansCommand,
  ListBackupJobsCommand,
} from "@aws-sdk/client-backup";
import { backupClient, cloudTrailClient, s3Client } from "../init";

// Access logs: Maintain logs of who accesses the systems and data.
const getAccessControlLogs = async (startTime: Date, endTime: Date) => {
  try {
    const command = new LookupEventsCommand({
      StartTime: startTime,
      EndTime: endTime,
    });
    const response = await cloudTrailClient.send(command);
    return response.Events; // Contains the logs of API access events
  } catch (error) {
    console.error("Error fetching access control logs:", error);
    throw error;
  }
};

// Contingency operations: Ensure facilities can recover from disaster scenarios.
const getDisasterRecoveryPolicies = async () => {
  try {
    const backupPlansResponse = await backupClient.send(
      new ListBackupPlansCommand({})
    );
    const backupPlans = backupPlansResponse.BackupPlansList;

    const backupJobsResponse = await backupClient.send(
      new ListBackupJobsCommand({})
    );
    const backupJobs = backupJobsResponse.BackupJobs;

    return { backupPlans, backupJobs }; // Contains the backup plans and job statuses
  } catch (error) {
    console.error("Error fetching disaster recovery policies:", error);
    throw error;
  }
};

// (async () => {
//   try {
//     // Access control logs for the past week
//     const accessLogs = await getAccessControlLogs(
//       new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//       new Date()
//     );
//     console.log("Access Control Logs:", accessLogs);

//     // Disaster recovery policies
//     const disasterRecoveryData = await getDisasterRecoveryPolicies();
//     console.log("Disaster Recovery Policies:", disasterRecoveryData);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// })();



// Data deletion logs: Logs showing secure data disposal.
export const deleteS3Object = async (bucketName: string, objectKey: string) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });
    const response = await s3Client.send(command);
    console.log(`Object deleted: ${objectKey} from bucket: ${bucketName}`);
    return response;
  } catch (error) {
    console.error("Error deleting S3 object:", error);
    throw error;
  }
};

// Data deletion logs: Logs showing secure data disposal.
export const getDataDeletionLogs = async (startTime: string, endTime: string) => {
  try {
    const command = new LookupEventsCommand({
      LookupAttributes: [
        {
          AttributeKey: "EventName",
          AttributeValue: "DeleteObject",
        },
      ],
      StartTime: new Date(startTime),
      EndTime: new Date(endTime),
    });

    const response = await cloudTrailClient.send(command);
    console.log("Data deletion logs:", response.Events);
    return response.Events;
  } catch (error) {
    console.error("Error retrieving data deletion logs:", error);
    throw error;
  }
};

// Backup logs: Proof that data backups were performed.
export const getBackupLogs = async (startTime: Date, endTime: Date) => {
  try {
    const command = new LookupEventsCommand({
      LookupAttributes: [
        {
          AttributeKey: "EventName",
          AttributeValue: "PutObject",
        },
      ],
      StartTime: new Date(startTime),
      EndTime: new Date(endTime),
    });

    const response = await cloudTrailClient.send(command);
    console.log("Backup logs:", response.Events);
    return response.Events;
  } catch (error) {
    console.error("Error retrieving backup logs:", error);
    throw error;
  }
};

// (async () => {
//   try {
//     await deleteS3Object("my-bucket", "my-object-key");

//     const deletionLogs = await getDataDeletionLogs(
//       "2024-11-01T00:00:00Z",
//       "2024-11-10T23:59:59Z"
//     );
//     console.log("Deletion Logs:", deletionLogs);

//     const backupLogs = await getBackupLogs(
//       "2024-11-01T00:00:00Z",
//       "2024-11-10T23:59:59Z"
//     );
//     console.log("Backup Logs:", backupLogs);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// })();