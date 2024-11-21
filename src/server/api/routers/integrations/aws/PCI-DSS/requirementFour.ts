import { ListCertificatesCommand } from "@aws-sdk/client-acm";
import { GetDistributionConfigCommand } from "@aws-sdk/client-cloudfront";
import { LookupEventsCommand } from "@aws-sdk/client-cloudtrail";
import { DescribeLoadBalancersCommand } from "@aws-sdk/client-elastic-load-balancing-v2";
import {
  acmClient,
  cloudFrontClient,
  cloudTrailClient,
  elbV2Client,
} from "../init";

// List SSL/TLS Certificates using AWS Certificate Manager (ACM)
async function listSSLCertificates() {
  try {
    const command = new ListCertificatesCommand({});
    const data = await acmClient.send(command);
    return data.CertificateSummaryList;
  } catch (error) {
    console.error("Error listing SSL/TLS certificates:", error);
    throw error;
  }
}

// Retrieve CloudFront Distribution Configurations to Verify SSL/TLS Enforcement
async function getCloudFrontSSLConfig(distributionId: string) {
  try {
    const command = new GetDistributionConfigCommand({ Id: distributionId });
    const data = await cloudFrontClient.send(command);
    return data.DistributionConfig;
  } catch (error) {
    console.error(
      `Error retrieving CloudFront config for distribution ${distributionId}:`,
      error
    );
    throw error;
  }
}

// Describe Load Balancers to Check for SSL/TLS Enforcement using AWS Elastic Load Balancing (ELB)
async function describeLoadBalancers() {
  try {
    const command = new DescribeLoadBalancersCommand({});
    const data = await elbV2Client.send(command);
    return data.LoadBalancers;
  } catch (error) {
    console.error("Error describing load balancers:", error);
    throw error;
  }
}

// Check Encryption Logs for Data Transmission

async function getEncryptionLogs(startTime: Date, endTime: Date) {
  try {
    const command = new LookupEventsCommand({
      StartTime: startTime,
      EndTime: endTime,
      LookupAttributes: [
        { AttributeKey: "EventSource", AttributeValue: "acm.amazonaws.com" },
        {
          AttributeKey: "EventSource",
          AttributeValue: "cloudfront.amazonaws.com",
        },
        {
          AttributeKey: "EventSource",
          AttributeValue: "elasticloadbalancing.amazonaws.com",
        },
      ],
    });
    const data = await cloudTrailClient.send(command);
    return data.Events;
  } catch (error) {
    console.error("Error retrieving encryption logs:", error);
    throw error;
  }
}

export async function getEvidence() {
  try {
    const sslCertificates = await listSSLCertificates();
    const cloudFrontConfig = await getCloudFrontSSLConfig("distributionId");
    const loadBalancers = await describeLoadBalancers();
    const encryptionLogs = await getEncryptionLogs(new Date(), new Date());
    return { sslCertificates, cloudFrontConfig, loadBalancers, encryptionLogs };
  } catch (error) {
    console.error("Error retrieving evidence for Requirement 4:", error);
    throw error;
  }
}
