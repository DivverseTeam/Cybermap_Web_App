import { RecoveryServicesClient, Vault } from "@azure/arm-recoveryservices";
import {
  Job,
  SiteRecoveryManagementClient,
} from "@azure/arm-recoveryservices-siterecovery";
import {
  JobResource,
  ProtectedItemResource,
  RecoveryPointResource,
  RecoveryServicesBackupClient,
} from "@azure/arm-recoveryservicesbackup";
import { ControlStatus } from "~/lib/types/controls";
import { AzureAUth, evaluate, saveEvidence } from "../../common";
import { asyncIteratorToArray } from "../common";
import { getCredentials } from "../init";

async function getBackupLogs({
  controlName,
  controlId,
  organisationId,
  subscriptionId,
  recoveryServicesClient,
  backupClient,
}: {
  controlName: string;
  controlId: string;
  organisationId: string;
  subscriptionId: string;
  recoveryServicesClient: RecoveryServicesClient;
  backupClient: RecoveryServicesBackupClient;
}) {
  try {
    const evd_name = `Backup logs`;
    // List all Recovery Services vaults in the subscription
    const evidence = [];
    const vaultsIterator =
      await recoveryServicesClient.vaults.listBySubscriptionId();
    const vaults: Vault[] = await asyncIteratorToArray(vaultsIterator);
    console.log("getBackupLogs", vaults);

    if (!vaults || vaults.length === 0) {
      return ControlStatus.Enum.NOT_IMPLEMENTED; // No vaults found
    }

    let hasRecentBackups = false;
    let hasRecoveryPoints = false;

    for (const vault of vaults) {
      if (!vault.id) continue;
      const resourceGroupName = vault.id.split("/")[4]; // Extract resource group name from the vault ID
      const vaultName = vault.name;
      if (!vaultName) continue;
      if (!resourceGroupName) continue;
      // Specify the fabric name (e.g., Azure)
      const fabricName = "Azure"; // Adjust as needed based on your environment

      // List backup items in the current vault
      const backupItemsResponseIterator =
        await backupClient.backupProtectedItems.list(
          vaultName,
          resourceGroupName
        );
      const backupItemsResponse: ProtectedItemResource[] =
        await asyncIteratorToArray(backupItemsResponseIterator);
      //   const backupItems = backupItemsResponse.value;

      for (const item of backupItemsResponse) {
        if (!item.properties) continue;
        const properties: any = item.properties;
        const containerName = properties.containerName;
        if (!containerName) continue;
        const itemName = properties?.friendlyName;
        if (!itemName) continue;

        // List recovery points for the current backup item

        const recoveryPointsResponseIterator =
          await backupClient.recoveryPoints.list(
            vaultName,
            resourceGroupName,
            fabricName,
            containerName,
            itemName
          );
        const recoveryPointsResponse: RecoveryPointResource[] =
          await asyncIteratorToArray(recoveryPointsResponseIterator);

        const recoveryPoints = recoveryPointsResponse || [];

        // Check if the item has a recent recovery point (within the last 7 days)
        const hasRecentRecoveryPoint = recoveryPoints.some((rp) => {
          if (!rp.properties) return false;
          const properties: any = rp.properties;
          if (!properties?.recoveryPointTime) return false;
          return (
            new Date(properties?.recoveryPointTime) >
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          );
        });

        if (hasRecentRecoveryPoint) {
          hasRecoveryPoints = true;
        }

        // Check if the backup job associated with the item completed successfully in the last 7 days
        const backupJobsResponseIterator = await backupClient.backupJobs.list(
          vaultName,
          resourceGroupName
        );
        const backupJobsResponse: JobResource[] = await asyncIteratorToArray(
          backupJobsResponseIterator
        );

        evidence.push({
          vaultName,
          backupItemsResponse,
          recoveryPointsResponse,
          backupJobsResponse,
        });

        const recentJob = backupJobsResponse.find((job) => {
          if (!job.properties) return false;
          const properties: any = job.properties;
          if (!properties?.endTime) return false;
          return (
            properties.status === "Completed" &&
            new Date(properties.endTime) >
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          );
        });

        if (recentJob) {
          hasRecentBackups = true;
        }
      }
    }

    await saveEvidence({
      fileName: `Azure-${controlName}-${evd_name}`,
      body: {
        evidence,
      },
      controls: ["ISO27001-1"],
      controlId,
      organisationId,
    });

    if (hasRecentBackups && hasRecoveryPoints) {
      return ControlStatus.Enum.FULLY_IMPLEMENTED;
    } else if (hasRecentBackups || hasRecoveryPoints) {
      return ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
    } else {
      return ControlStatus.Enum.NOT_IMPLEMENTED;
    }
  } catch (error: any) {
    console.error("Error checking backup status:", error.message);
    throw error;
  }
}

async function getDisasterRecoveryTestResults({
  controlName,
  controlId,
  organisationId,
  subscriptionId,
  siteRecoveryClient,
  recoveryServicesClient,
}: {
  controlName: string;
  controlId: string;
  organisationId: string;
  subscriptionId: string;
  siteRecoveryClient: SiteRecoveryManagementClient;
  recoveryServicesClient: RecoveryServicesClient;
}) {
  try {
    const evd_name = `Disaster recovery test results`;

    // List all vaults in the subscription
    const evidence = [];
    const vaultsIterator =
      await recoveryServicesClient.vaults.listBySubscriptionId();
    const vaults: Vault[] = await asyncIteratorToArray(vaultsIterator);

    let totalTestRuns = 0;
    let totalSuccessfulTests = 0;
    let totalVaults = 0;

    for (const vault of vaults) {
      if (!vault.id) continue;
      const resourceGroupName = vault.id.split("/")[4];
      const vaultName = vault.name;
      totalVaults++;

      if (!vaultName) continue;
      if (!resourceGroupName) continue;
      // Fetch replication jobs for each vault
      const jobsIterator = await siteRecoveryClient.replicationJobs.list(
        vaultName,
        resourceGroupName
      );
      const jobs: Job[] = await asyncIteratorToArray(jobsIterator);
      evidence.push({
        vaultName,
        jobs,
      });

      for (const job of jobs) {
        if (!job.properties) continue;
        const jobProperties = job.properties;
        if (jobProperties.scenarioName === "TestFailover") {
          totalTestRuns++;
          if (jobProperties.state === "Succeeded") {
            totalSuccessfulTests++;
          }
        }
      }
    }

    await saveEvidence({
      fileName: `Azure-${controlName}-${evd_name}`,
      body: {
        evidence,
      },
      controls: ["ISO27001-1"],
      controlId,
      organisationId,
    });

    if (totalTestRuns === 0) {
      return ControlStatus.Enum.NOT_IMPLEMENTED;
    } else if (totalTestRuns === totalSuccessfulTests && totalVaults > 0) {
      return ControlStatus.Enum.FULLY_IMPLEMENTED;
    } else {
      return ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
    }
  } catch (error) {
    console.error("Error checking disaster recovery status:", error);
    throw error;
  }
}

async function getRequirementTwelveStatus({
  azureCloud,
  controlName,
  controlId,
  organisationId,
}: AzureAUth) {
  if (!azureCloud) throw new Error("Azure cloud is required");
  const { credential, subscriptionId } = getCredentials(azureCloud);
  const backupClient = new RecoveryServicesBackupClient(
    credential,
    subscriptionId
  );
  const recoveryServicesClient = new RecoveryServicesClient(
    credential,
    subscriptionId
  );
  const siteRecoveryClient = new SiteRecoveryManagementClient(
    credential,
    subscriptionId
  );

  return evaluate([
    () =>
      getBackupLogs({
        controlName,
        controlId,
        organisationId,
        subscriptionId,
        recoveryServicesClient,
        backupClient,
      }),
    () =>
      getDisasterRecoveryTestResults({
        controlName,
        controlId,
        organisationId,
        subscriptionId,
        siteRecoveryClient,
        recoveryServicesClient,
      }),
  ]);
}

export { getRequirementTwelveStatus };
