import { backupClient } from "./init";
import {
  ListBackupPlansCommand,
  ListBackupJobsCommand,
  BackupJob,
  DescribeBackupVaultCommand,
} from "@aws-sdk/client-backup";

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
/**
 * Retrieves all completed AWS Backup recovery jobs with their status.
 */
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
