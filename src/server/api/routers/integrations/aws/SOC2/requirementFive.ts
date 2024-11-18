import {
  DescribeTrailsCommand,
  Event,
  GetTrailStatusCommand,
  LookupEventsCommand,
} from "@aws-sdk/client-cloudtrail";
import { DescribeLogGroupsCommand } from "@aws-sdk/client-cloudwatch-logs";
import {
  GetVaultAccessPolicyCommand,
  ListVaultsCommand,
} from "@aws-sdk/client-glacier";
import {
  GetBucketLifecycleConfigurationCommand,
} from "@aws-sdk/client-s3";
import {
  cloudTrailClient,
  cloudWatchLogsClient,
  glacierClient,
  s3Client,
} from "../init";
import { getAllS3Buckets } from "../common";

// Data retention policies: Logs of how long data is stored before deletion or archival.
async function getCloudWatchLogRetention() {
  const describeLogGroupsCommand = new DescribeLogGroupsCommand({});
  const logGroups = await cloudWatchLogsClient.send(describeLogGroupsCommand);
  if (!logGroups.logGroups) return [];
  return logGroups.logGroups.map((logGroup) => ({
    logGroupName: logGroup.logGroupName,
    retentionInDays: logGroup.retentionInDays || "Never expires",
  }));
}

// Data retention policies: Logs of how long data is stored before deletion or archival.
async function getS3BucketLifecyclePolicies() {
  const buckets = await getAllS3Buckets();
  if (!buckets) return [];
  const lifecyclePolicies = [];

  for (const bucket of buckets) {
    try {
      const getBucketLifecycleConfigurationCommand =
        new GetBucketLifecycleConfigurationCommand({ Bucket: bucket.Name });
      const lifecycle = await s3Client.send(
        getBucketLifecycleConfigurationCommand
      );

      lifecyclePolicies.push({
        bucketName: bucket.Name,
        rules: lifecycle?.Rules
          ? lifecycle.Rules.map((rule) => ({
              id: rule.ID,
              status: rule.Status,
              transitions: rule.Transitions || [],
              expiration: rule.Expiration
                ? {
                    days: rule.Expiration.Days,
                    date: rule.Expiration.Date,
                  }
                : null,
              noncurrentVersionExpiration: rule.NoncurrentVersionExpiration
                ? {
                    noncurrentDays:
                      rule.NoncurrentVersionExpiration.NoncurrentDays,
                  }
                : null,
              noncurrentVersionTransitions: rule.NoncurrentVersionTransitions
                ? rule.NoncurrentVersionTransitions.map((nv) => ({
                    noncurrentDays: nv.NoncurrentDays,
                    storageClass: nv.StorageClass,
                  }))
                : [],
            }))
          : [],
      });
    } catch (error: any) {
      console.error(
        `Error fetching lifecycle for bucket ${bucket.Name}: ${error.message}`
      );
    }
  }
  return lifecyclePolicies;
}

// Data retention policies: Logs of how long data is stored before deletion or archival.
async function getCloudTrailLogRetention() {
  const describeTrailsCommand = new DescribeTrailsCommand({});
  const trails = await cloudTrailClient.send(describeTrailsCommand);
  if (!trails.trailList) return [];
  const trailSettings = await Promise.all(
    trails.trailList.map(async (trail) => {
      const { Name, S3BucketName, LogFileValidationEnabled } = trail;
      const getTrailStatusCommand = new GetTrailStatusCommand({ Name });
      const trailStatus = await cloudTrailClient.send(getTrailStatusCommand);
      return {
        trailName: Name,
        s3Bucket: S3BucketName,
        logFileValidationEnabled: LogFileValidationEnabled,
        // retentionDays: trailStatus.RetentionPeriod || 'Not specified in CloudTrail',
      };
    })
  );
  return trailSettings;
}

async function getVaultAccessPolicy() {
  try {
    const command = new ListVaultsCommand({
      accountId: "-",
    });
    const response = await glacierClient.send(command);
    console.log("Vaults:", response.VaultList);
    if (!response.VaultList) return [];
    const vaultPolicies = await Promise.all(
      response.VaultList.map(async (vault: any) => {
        const getVaultAccessPolicyCommand = new GetVaultAccessPolicyCommand({
          accountId: "-",
          vaultName: vault.VaultName,
        });
        const data = await glacierClient.send(getVaultAccessPolicyCommand);
        return data.policy;
      })
    );

    return vaultPolicies;
  } catch (error) {
    console.error("Error fetching vault access policy:", error);
    throw error;
  }
}

// Deletion and archival logs: Evidence of data being securely deleted or moved to long-term storage after the retention period.
async function getDeletionAndArchivalLogs(
  startTime = new Date(),
  endTime = new Date()
) {
  try {
    const lookupEventsCommand = new LookupEventsCommand({
      StartTime: startTime,
      EndTime: endTime,
      LookupAttributes: [
        {
          AttributeKey: "EventName",
          AttributeValue: "DeleteObject",
        },
        {
          AttributeKey: "EventName",
          AttributeValue: "PutObject",
        },
      ],
    });
    const data = await cloudTrailClient.send(lookupEventsCommand);
    if (!data.Events) return [];

    // Filter for delete and archive actions in CloudTrail logs
    const relevantEvents = data.Events.filter((event: Event) => {
      return (
        event.EventName &&
        ["DeleteObject", "PutObject"].includes(event.EventName)
      );
    });

    return relevantEvents.map((event) => ({
      eventId: event.EventId,
      eventName: event.EventName,
      eventTime: event.EventTime,
      userName: event.Username,
      resources: event?.Resources
        ? event.Resources.map((resource) => ({
            resourceName: resource.ResourceName,
            resourceType: resource.ResourceType,
          }))
        : [],
      eventSource: event.EventSource,
    }));
  } catch (error) {
    console.error("Error fetching deletion and archival logs:", error);
    throw error;
  }
}

async function getRetentionPolicyEvidence() {
  try {
    const [
      cloudWatchRetention,
      s3LifecyclePolicies,
      cloudTrailRetention,
      vaultAccessPolicy,
    ] = await Promise.all([
      getCloudWatchLogRetention(),
      getS3BucketLifecyclePolicies(),
      getCloudTrailLogRetention(),
      getVaultAccessPolicy(),
    ]);

    return {
      cloudWatchRetention,
      s3LifecyclePolicies,
      cloudTrailRetention,
      vaultAccessPolicy,
    };
  } catch (error) {
    console.error("Error fetching data retention policy evidence:", error);
    throw error;
  }
}

async function getDeletionAndArchivalLogsEvidence() {
  try {
    const deletionAndArchivalLogs = await getDeletionAndArchivalLogs();
    return {
      deletionAndArchivalLogs,
    };
  } catch (error) {
    console.error("Error fetching deletion and archival logs evidence:", error);
    throw error;
  }
}

export { getDeletionAndArchivalLogsEvidence, getRetentionPolicyEvidence };
