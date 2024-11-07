import { ACMClient } from "@aws-sdk/client-acm";
import { BackupClient } from "@aws-sdk/client-backup";
import { CloudTrailClient } from "@aws-sdk/client-cloudtrail";
import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";
import { CloudWatchLogsClient } from "@aws-sdk/client-cloudwatch-logs";
import { ConfigServiceClient } from "@aws-sdk/client-config-service";
import { EC2Client } from "@aws-sdk/client-ec2";
import {
  ElasticLoadBalancingV2Client,
} from "@aws-sdk/client-elastic-load-balancing-v2";
import {
  CloudFrontClient,
} from "@aws-sdk/client-cloudfront";
import {
  NetworkFirewallClient,
} from "@aws-sdk/client-network-firewall";
import { GlacierClient } from "@aws-sdk/client-glacier";
import { GuardDutyClient } from "@aws-sdk/client-guardduty";
import { HealthClient } from "@aws-sdk/client-health";
import { IAMClient } from "@aws-sdk/client-iam";
import { KMSClient } from "@aws-sdk/client-kms";
import { S3 } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";
import {
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { RDSClient } from "@aws-sdk/client-rds";
import { SSMClient } from "@aws-sdk/client-ssm";
import {
  Inspector2Client,
} from "@aws-sdk/client-inspector2";
import {
  InspectorClient,
} from "@aws-sdk/client-inspector";


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
const acmClient = new ACMClient(globalConfig);
const glacierClient = new GlacierClient(globalConfig);
const networkFirewallClient = new NetworkFirewallClient(globalConfig);
const secretsManagerClient = new SecretsManagerClient(globalConfig);
const rdsClient = new RDSClient(globalConfig);
const cloudFrontClient = new CloudFrontClient(globalConfig);
const ssmClient = new SSMClient(globalConfig);
const inspectorClient = new InspectorClient(globalConfig);
const inspector2Client = new Inspector2Client(globalConfig);
const elbV2Client = new ElasticLoadBalancingV2Client(
  globalConfig
);

export {
  acmClient,
  backupClient,
  cloudTrailClient,
  cloudWatchClient,
  cloudWatchLogsClient,
  configServiceClient,
  ec2Client,
  glacierClient,
  guardDutyClient,
  healthClient,
  iamClient,
  kmsClient,
  s3Client,
  networkFirewallClient,
  secretsManagerClient,
  rdsClient,
  cloudFrontClient,
  elbV2Client,
  ssmClient,
  inspectorClient,
  inspector2Client
};
