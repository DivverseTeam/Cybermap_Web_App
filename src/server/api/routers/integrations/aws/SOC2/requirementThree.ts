// Backup and Disaster Recovery (Availability)

import {
  BackupJob,
  DescribeBackupVaultCommand,
  ListBackupJobsCommand,
  ListBackupPlansCommand,
} from "@aws-sdk/client-backup";
import {
  LookupAttribute,
  LookupEventsCommand,
} from "@aws-sdk/client-cloudtrail";
import { DescribeSnapshotsCommand, Snapshot } from "@aws-sdk/client-ec2";
import { backupClient, cloudTrailClient, ec2Client } from "../init";

// Backup schedules: Logs showing regular backup processes.
async function getBackupPlan() {
  try {
    // List all backup plans
    const listBackupPlansCommand = new ListBackupPlansCommand();
    const backupPlansData = await backupClient.send(listBackupPlansCommand);
    const backupPlans = backupPlansData.BackupPlansList;
    if (!backupPlans) return [];

    return { backupPlans };
  } catch (error) {
    console.error("Error retrieving backup data:", error);
    throw error;
  }
}

// Backup schedules: Logs showing regular backup processes.
// Disaster recovery test results: Logs and reports of tested recovery processes and their success rates.
async function getBackupJobs() {
  try {
    const params = { MaxResults: 100, NextToken: "" };
    let completedJobs: any[] = [];
    let failedJobs: any[] = [];
    do {
      const listBackupJobsCommand = new ListBackupJobsCommand();
      // List backup jobs for each plan
      const data = await backupClient.send(listBackupJobsCommand);
      if (!data.BackupJobs) return [];
      // Filter for completed and failed jobs
      const completed = data.BackupJobs.filter(
        (job: BackupJob) => job.State === "COMPLETED"
      );
      const failed = data.BackupJobs.filter(
        (job: BackupJob) => job.State === "FAILED"
      );

      completedJobs = completedJobs.concat(completed);
      failedJobs = failedJobs.concat(failed);

      // Set the next token for pagination
      if (data.NextToken) {
        params.NextToken = data.NextToken;
      }
    } while (params.NextToken);

    console.log("Completed Backup Jobs:", completedJobs);
    console.log("Failed Backup Jobs:", failedJobs);

    return { completedJobs, failedJobs };
  } catch (error) {
    console.error("Error retrieving backup jobs:", error);
    throw error;
  }
}

// Backup encryption: Proof that backups are encrypted.
async function verifyBackupEncryption() {
  try {
    const params = { MaxResults: 100, NextToken: "" };
    let encryptedBackups: {
      BackupJobId: any;
      ResourceType: any;
      // Backup schedules
      CreationDate: any;
      EncryptionKeyArn: any;
    }[] = [];

    let unencryptedBackups: {
      BackupJobId: any;
      ResourceType: any;
      CreationDate: any;
    }[] = [];

    do {
      const listBackupJobsCommand = new ListBackupJobsCommand();
      const data = await backupClient.send(listBackupJobsCommand);
      if (!data.BackupJobs) return [];
      // Check encryption status for each backup

      for (const job of data.BackupJobs) {
        const describeBackupVaultCommand = new DescribeBackupVaultCommand({
          BackupVaultName: job.BackupVaultName,
        });
        const vaultResponse = await backupClient.send(
          describeBackupVaultCommand
        );
        if (!vaultResponse) continue;
        if (vaultResponse.EncryptionKeyArn) {
          encryptedBackups.push({
            BackupJobId: job.BackupJobId,
            ResourceType: job.ResourceType,
            CreationDate: job.CreationDate,
            EncryptionKeyArn: vaultResponse.EncryptionKeyArn,
          });
        } else {
          unencryptedBackups.push({
            BackupJobId: job.BackupJobId,
            ResourceType: job.ResourceType,
            CreationDate: job.CreationDate,
          });
        }
      }

      // Update NextToken for pagination
      if (data.NextToken) {
        params.NextToken = data.NextToken;
      }
    } while (params.NextToken);

    console.log("Encrypted Backups:", encryptedBackups);
    console.log("Unencrypted Backups:", unencryptedBackups);

    return { encryptedBackups, unencryptedBackups };
  } catch (error) {
    console.error("Error verifying backup encryption:", error);
    throw error;
  }
}

// Disaster recovery test results: Logs and reports of tested recovery processes and their success rates.
async function listEC2Snapshots() {
  try {
    const params = {
      OwnerIds: ["self"],
      NextToken: "",
    };

    let snapshots: any[] = [];
    let data;
    do {
      const describeSnapshotsCommand = new DescribeSnapshotsCommand(params);
      data = await ec2Client.send(describeSnapshotsCommand);
      if (!data.Snapshots) return [];
      // Add snapshots to the list
      snapshots = snapshots.concat(
        data.Snapshots.map((snapshot: Snapshot) => ({
          SnapshotId: snapshot.SnapshotId,
          VolumeId: snapshot.VolumeId,
          StartTime: snapshot.StartTime,
          State: snapshot.State,
          Progress: snapshot.Progress,
          Description: snapshot.Description,
        }))
      );

      // Update NextToken for pagination
      params.NextToken = data.NextToken || "";
    } while (params.NextToken);

    console.log("EBS Snapshots:", snapshots);
    return snapshots;
  } catch (error) {
    console.error("Error retrieving EBS snapshots:", error);
  }
}

// Disaster recovery test results: Logs and reports of tested recovery processes and their success rates.
// test disaster recovery by attempting a snapshot recovery
// export async function testDisasterRecovery(snapshotId: any) {
//   try {
//     // Start recovery from snapshot by creating a volume (simulated recovery test)
//     const volume = await ec2Client
//       .createVolume({
//         SnapshotId: snapshotId,
//         AvailabilityZone: "your-availability-zone", // Replace with the correct AZ
//       })
//       .promise();

//     // Log successful recovery attempt
//     const logEntry = {
//       timestamp: new Date().toISOString(),
//       snapshotId,
//       recoveryStatus: "SUCCESS",
//       volumeId: volume.VolumeId,
//       message: "Volume successfully created from snapshot for recovery test.",
//     };
//     // logResult(logEntry);
//     return logEntry;
//   } catch (error: any) {
//     // Log failed recovery attempt
//     const logEntry = {
//       timestamp: new Date().toISOString(),
//       snapshotId,
//       recoveryStatus: "FAILED",
//       message: `Failed to recover from snapshot: ${error.message}`,
//     };
//     // logResult(logEntry);
//     throw error;
//   }
// }

// Regularly list EC2 snapshots to ensure that backup processes are functioning and timely.
async function checkEC2RegularBackup() {
  try {
    // Retrieve snapshots created by your account
    const describeSnapshotsCommand = new DescribeSnapshotsCommand({
      OwnerIds: ["self"], // Only get snapshots owned by this account
    });
    const snapshots = await ec2Client.send(describeSnapshotsCommand);
    if (!snapshots.Snapshots) return [];
    // Sort snapshots by StartTime (creation date) in descending order
    const sortedSnapshots = snapshots.Snapshots.sort(
      //@ts-ignore
      (a: any, b: any) => new Date(b.StartTime) - new Date(a.StartTime)
    );

    console.log("EC2 Snapshots:", JSON.stringify(sortedSnapshots, null, 2));

    // Optional: Check if recent snapshots exist (e.g., within the last 24 hours)
    const now = new Date();
    const oneDayAgo = new Date(now.setDate(now.getDate() - 1));
    const recentSnapshots = sortedSnapshots.filter(
      //@ts-ignore
      (snapshot: { StartTime: string | number | Date }) =>
        new Date(snapshot.StartTime) > oneDayAgo
    );

    if (recentSnapshots.length > 0) {
      console.log(
        "Recent Snapshots (last 24 hours):",
        JSON.stringify(recentSnapshots, null, 2)
      );
    } else {
      console.log("No snapshots created in the last 24 hours.");
    }
  } catch (error) {
    console.error("Error retrieving EC2 snapshots:", error);
  }
}

// Function to get CloudTrail events indicating potential incidents
async function getCloudTrailEvents({
  lookupAttributes,
  startTime,
  endTime,
  maxResults,
}: {
  startTime: Date;
  endTime: Date;
  lookupAttributes: LookupAttribute[];
  maxResults: number;
}) {
  try {
    const lookupEventsCommand = new LookupEventsCommand({
      LookupAttributes: lookupAttributes,
      StartTime: startTime, // Last 24 hours
      EndTime: endTime,
      MaxResults: maxResults,
    });
    const events = await cloudTrailClient.send(lookupEventsCommand);
    console.log("CloudTrail Events:", events.Events);
    return { events: events.Events, nextToken: events.NextToken };
  } catch (error) {
    console.error("Error fetching CloudTrail events:", error);
  }
}

// Disaster recovery test results: Logs and reports of tested recovery processes and their success rates.
async function getCloudTrailRecoveryLogs() {
  try {
    const response = await getCloudTrailEvents({
      lookupAttributes: [
        { AttributeKey: "EventName", AttributeValue: "StartBackupJob" },
        { AttributeKey: "EventName", AttributeValue: "RestoreBackupJob" },
      ],
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      endTime: new Date(),
      maxResults: 50,
    });
    const events = response?.events;
    if (!events) return [];
  } catch (error) {
    console.error("Error retrieving CloudTrail logs:", error);
  }
}

async function getBackupScheduleEvidence() {
  try {
    const backupPlans = await getBackupPlan();
    const backupJobs = await getBackupJobs();
    const ec2BackupCheck = await checkEC2RegularBackup();

    return {
      backupPlans,
      backupJobs,
      ec2BackupCheck,
    };
  } catch (error) {
    console.error("Error retrieving backup schedule evidence:", error);
    throw error;
  }
}

async function getBackupEncryptionEvidence() {
  try {
    const encryptionStatus = await verifyBackupEncryption();
    return {
      encryptionStatus,
    };
  } catch (error) {
    console.error("Error retrieving backup encryption evidence:", error);
    throw error;
  }
}

async function getDisasterRecoveryTestResults() {
  try {
    const snapshots = await listEC2Snapshots();
    const backupJobs = await getBackupJobs(); // for success/failure status of jobs
    const recoveryLogs = await getCloudTrailRecoveryLogs();

    return {
      snapshots,
      backupJobs,
      recoveryLogs,
    };
  } catch (error) {
    console.error("Error retrieving disaster recovery test results:", error);
    throw error;
  }
}

export {
  getBackupEncryptionEvidence,
  getBackupScheduleEvidence,
  getDisasterRecoveryTestResults,
};
