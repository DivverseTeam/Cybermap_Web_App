// Import required AWS SDK clients
import {
  ListBackupJobsCommand,
  ListRecoveryPointsByBackupVaultCommand,
} from "@aws-sdk/client-backup";
import { DescribeStacksCommand } from "@aws-sdk/client-cloudformation";
import { backupClient, cloudFormationClient } from "../init";

/**
 * Retrieve Backup Logs
 * Evidence Needed: Backup logs - Proof that critical data is regularly backed up.
 * Uses AWS Backup API to list backup jobs, showing records of regular backups.
 */
const getBackupLogs = async () => {
  try {
    const command = new ListBackupJobsCommand({});
    const response = await backupClient.send(command);
    return response.BackupJobs;
  } catch (error) {
    console.error("Error retrieving backup logs:", error);
    throw error;
  }
};

/**
 * Retrieve Recovery Points
 * Evidence Needed: Backup logs - Proof that critical data can be restored from backups.
 * Uses AWS Backup API to list recovery points in a specific backup vault.
 */
const getRecoveryPoints = async (backupVaultName: string) => {
  try {
    const command = new ListRecoveryPointsByBackupVaultCommand({
      BackupVaultName: backupVaultName,
    });
    const response = await backupClient.send(command);
    return response.RecoveryPoints;
  } catch (error) {
    console.error("Error retrieving recovery points:", error);
    throw error;
  }
};

/**
 * Retrieve Disaster Recovery Test Results
 * Evidence Needed: Disaster recovery test results - Evidence that disaster recovery plans have been tested and validated.
 * Uses AWS CloudFormation API to describe stack statuses, showing the state of infrastructure recovery or tests.
 */
const getDisasterRecoveryTestResults = async (stackName: string) => {
  try {
    const command = new DescribeStacksCommand({ StackName: stackName });
    const response = await cloudFormationClient.send(command);
    return response.Stacks;
  } catch (error) {
    console.error("Error retrieving disaster recovery test results:", error);
    throw error;
  }
};

// // Example usage
// (async () => {
//   // Fetch backup logs
//   const backupLogs = await getBackupLogs();
//   console.log("Backup Logs:", backupLogs);

//   // Fetch recovery points for a specific backup vault
//   const recoveryPoints = await getRecoveryPoints("your-backup-vault-name");
//   console.log("Recovery Points:", recoveryPoints);

//   // Fetch disaster recovery test results for a specific stack
//   const drTestResults = await getDisasterRecoveryTestResults("your-stack-name");
//   console.log("Disaster Recovery Test Results:", drTestResults);
// })();
