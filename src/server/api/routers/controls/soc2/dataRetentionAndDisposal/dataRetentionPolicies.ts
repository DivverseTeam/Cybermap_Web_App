import {
  getCloudTrailLogRetention,
  getCloudWatchLogRetention,
  getS3BucketLifecyclePolicies,
} from "../../../integrations/aws/SOC2/requirementFive";

async function getDataRetentionPoliciesAws() {
  const [cloudWatchRetention, s3Lifecycles, cloudTrailRetention] =
    await Promise.all([
      getCloudWatchLogRetention(),
      getS3BucketLifecyclePolicies(),
      getCloudTrailLogRetention(),
    ]);

  return {
    cloudWatchLogs: cloudWatchRetention,
    s3Buckets: s3Lifecycles,
    cloudTrailLogs: cloudTrailRetention,
  };
}
