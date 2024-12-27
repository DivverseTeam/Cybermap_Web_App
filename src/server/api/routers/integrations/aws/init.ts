import { ACMClient } from "@aws-sdk/client-acm";
import { BackupClient } from "@aws-sdk/client-backup";
import { CloudFormationClient } from "@aws-sdk/client-cloudformation";
import { CloudFrontClient } from "@aws-sdk/client-cloudfront";
import { CloudTrailClient } from "@aws-sdk/client-cloudtrail";
import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";
import { CloudWatchEventsClient } from "@aws-sdk/client-cloudwatch-events";
import { CloudWatchLogsClient } from "@aws-sdk/client-cloudwatch-logs";
import { CodePipelineClient } from "@aws-sdk/client-codepipeline";
import { ConfigServiceClient } from "@aws-sdk/client-config-service";
import { EC2Client } from "@aws-sdk/client-ec2";
import { ElasticLoadBalancingV2Client } from "@aws-sdk/client-elastic-load-balancing-v2";
import { GlacierClient } from "@aws-sdk/client-glacier";
import { GlueClient } from "@aws-sdk/client-glue";
import { GuardDutyClient } from "@aws-sdk/client-guardduty";
import { HealthClient } from "@aws-sdk/client-health";
import { IAMClient } from "@aws-sdk/client-iam";
import { InspectorClient } from "@aws-sdk/client-inspector";
import { Inspector2Client } from "@aws-sdk/client-inspector2";
import { KMSClient } from "@aws-sdk/client-kms";
import { NetworkFirewallClient } from "@aws-sdk/client-network-firewall";
import { RDSClient } from "@aws-sdk/client-rds";
import { ResourceGroupsTaggingAPIClient } from "@aws-sdk/client-resource-groups-tagging-api";
import { S3 } from "@aws-sdk/client-s3";
import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { SecurityHubClient } from "@aws-sdk/client-securityhub";
import { SSMClient } from "@aws-sdk/client-ssm";
// import { fromEnv } from "@aws-sdk/credential-providers";
import { env } from "~/env";

const globalConfig = {
  region: env.REGION ?? "eu-east-1",
  credentials: {
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
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
const elbV2Client = new ElasticLoadBalancingV2Client(globalConfig);
const glueClient = new GlueClient(globalConfig);
const securityHubClient = new SecurityHubClient(globalConfig);
const taggingClient = new ResourceGroupsTaggingAPIClient(globalConfig);
const codePipelineClient = new CodePipelineClient(globalConfig);
const cloudWatchEventsClient = new CloudWatchEventsClient(globalConfig);
const cloudFormationClient = new CloudFormationClient(globalConfig);

export {
  acmClient,
  backupClient,
  cloudFormationClient,
  cloudFrontClient,
  cloudTrailClient,
  cloudWatchClient,
  cloudWatchEventsClient,
  cloudWatchLogsClient,
  codePipelineClient,
  configServiceClient,
  ec2Client,
  elbV2Client,
  glacierClient,
  globalConfig,
  glueClient,
  guardDutyClient,
  healthClient,
  iamClient,
  inspector2Client,
  inspectorClient,
  kmsClient,
  networkFirewallClient,
  rdsClient,
  s3Client,
  secretsManagerClient,
  securityHubClient,
  ssmClient,
  taggingClient,
};
