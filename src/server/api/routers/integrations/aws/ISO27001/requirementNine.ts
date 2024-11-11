import { GetDistributionConfigCommand } from "@aws-sdk/client-cloudfront";
import {
  DescribeFlowLogsCommand,
  DescribeFlowLogsRequest,
} from "@aws-sdk/client-ec2";
import { cloudFrontClient, ec2Client } from "../init";

/**
 * Evidence Needed: Network encryption logs
 * Description: Retrieves VPC Flow Logs to show how network traffic is controlled
 * and ensure encryption in transit.
 */
const getVpcFlowLogs = async (flowLogId: string) => {
  try {
    const command = new DescribeFlowLogsCommand({ FlowLogIds: [flowLogId] });
    const response = await ec2Client.send(command);
    console.log("VPC Flow Logs:", response.FlowLogs);
    return response.FlowLogs;
  } catch (error) {
    console.error("Error retrieving VPC Flow Logs:", error);
    throw error;
  }
};

/**
 * Evidence Needed: Firewall rules
 * Description: Retrieves firewall rules based on VPC Flow Logs to confirm network traffic restriction
 * based on policy.
 */
const getFirewallRulesFromVpcFlowLogs = async (
  filterParams: DescribeFlowLogsRequest
) => {
  try {
    const command = new DescribeFlowLogsCommand(filterParams);
    const response = await ec2Client.send(command);
    console.log("Firewall Rules Logs:", response.FlowLogs);
    return response.FlowLogs;
  } catch (error) {
    console.error("Error retrieving firewall rules:", error);
    throw error;
  }
};

/**
 * Evidence Needed: Ensuring SSL/TLS certificates are enforced
 * Description: Checks CloudFront distribution configurations to ensure secure data transmission (SSL/TLS).
 */
const getCloudFrontDistributionConfig = async (distributionId: string) => {
  try {
    const command = new GetDistributionConfigCommand({ Id: distributionId });
    const response = await cloudFrontClient.send(command);
    console.log("CloudFront Distribution Config:", response.DistributionConfig);
    return response.DistributionConfig;
  } catch (error) {
    console.error("Error retrieving CloudFront distribution config:", error);
    throw error;
  }
};
