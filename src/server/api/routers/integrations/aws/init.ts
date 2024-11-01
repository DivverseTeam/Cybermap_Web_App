import { BackupClient } from "@aws-sdk/client-backup";
import { CloudTrailClient } from "@aws-sdk/client-cloudtrail";
import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";
import { CloudWatchLogsClient } from "@aws-sdk/client-cloudwatch-logs";
import { EC2Client } from "@aws-sdk/client-ec2";
import { IAMClient } from "@aws-sdk/client-iam";
import { KMSClient } from "@aws-sdk/client-kms";
import { GuardDutyClient } from "@aws-sdk/client-guardduty";
import { S3 } from "@aws-sdk/client-s3";
import { ConfigServiceClient } from "@aws-sdk/client-config-service";
import { HealthClient } from "@aws-sdk/client-health";
import { ACMClient } from "@aws-sdk/client-acm";
import { fromEnv } from "@aws-sdk/credential-providers";

const globalConfig = {
  region: process.env.AWS_REGION ? process.env.AWS_REGION : "eu-east-1",
  credentials: fromEnv(),
};

const iamClient = new IAMClient(globalConfig);
const cloudTrailClient = new CloudTrailClient(globalConfig);
const kmsClient = new KMSClient(globalConfig);
const s3Client = new S3(globalConfig);
const backupClient = new BackupClient(globalConfig);
const ec2Client = new EC2Client(globalConfig);
const cloudWatchClient = new CloudWatchClient(globalConfig);
const cloudWatchLogsClient = new CloudWatchLogsClient(globalConfig);
const configServiceClient = new ConfigServiceClient(globalConfig);
const guardDutyClient = new GuardDutyClient(globalConfig);
const healthClient = new HealthClient(globalConfig);
const acmClient = new HealthClient(ACMClient);

export {
  backupClient,
  cloudTrailClient,
  cloudWatchClient,
  ec2Client,
  iamClient,
  kmsClient,
  s3Client,
  configServiceClient,
  guardDutyClient,
  healthClient,
  cloudWatchLogsClient,
  acmClient,
};
