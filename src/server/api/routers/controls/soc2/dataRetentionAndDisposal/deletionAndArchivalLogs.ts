import {
  getDeletionAndArchivalLogs,
  getS3BucketLifecyclePolicies,
  getVaultAccessPolicy,
} from "../../../integrations/aws/SOC2/requirementFive";

async function deletionAndArchivalLogsAws() {
  const [s3Lifecycles, vaultAccessPolicy, cloudTrailDeletionAndArchivalLogs] =
    await Promise.all([
      getS3BucketLifecyclePolicies(),
      getVaultAccessPolicy(),
      getDeletionAndArchivalLogs(),
    ]);

  return {
    s3Buckets: s3Lifecycles,
    vaultAccess: vaultAccessPolicy,
    cloudTrailLogs: cloudTrailDeletionAndArchivalLogs,
  };
}
