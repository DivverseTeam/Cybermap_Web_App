// Requirement 1: Install and maintain a firewall configuration to protect cardholder data
import { FilterLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";
import { DescribeSecurityGroupsCommand } from "@aws-sdk/client-ec2";
import { DescribeFirewallPolicyCommand } from "@aws-sdk/client-network-firewall";
import {
  cloudWatchLogsClient,
  ec2Client,
  networkFirewallClient,
} from "../init";

/**
 * Retrieve AWS Security Group configurations as firewall evidence.
 * Security Groups act as virtual firewalls for AWS EC2 instances.
 */
async function getSecurityGroupConfigurations() {
  try {
    const command = new DescribeSecurityGroupsCommand({});
    const data = await ec2Client.send(command);
    return data.SecurityGroups; // Contains security group configurations
  } catch (error) {
    console.error("Error retrieving security group configurations:", error);
    throw error;
  }
}

/**
 * Retrieve AWS Network Firewall policies.
 * Firewall policies define rules for traffic filtering and monitoring.
 */
async function getFirewallPolicies(firewallArn: string) {
  try {
    const command = new DescribeFirewallPolicyCommand({
      FirewallPolicyArn: firewallArn,
    });
    const data = await networkFirewallClient.send(command);
    return data.FirewallPolicy; // Contains the firewall policy configurations
  } catch (error) {
    console.error("Error retrieving firewall policies:", error);
    throw error;
  }
}

/**
 * Retrieve CloudWatch Logs for monitoring rule changes and network traffic logs.
 * FilterLogEvents is used to query logs based on filters.
 */
async function getLogEvents(logGroupName: string) {
  try {
    const command = new FilterLogEventsCommand({
      logGroupName, // Name of the log group (e.g., firewall or network logs)
      limit: 50, // Adjust as necessary
      startTime: Date.now() - 7 * 24 * 60 * 60 * 1000, // last 7 days, can be adjusted
    });
    const data = await cloudWatchLogsClient.send(command);
    return data.events; // Contains filtered log events
  } catch (error) {
    console.error("Error retrieving log events:", error);
    throw error;
  }
}

export async function getEvidence() {
  const securityGroupConfigurations = await getSecurityGroupConfigurations();
  const firewallPolicies = await getFirewallPolicies("your-firewall-arn");
  const logEvents = await getLogEvents("your-log-group-name");

  return {
    securityGroupConfigurations,
    firewallPolicies,
    logEvents,
  };
}
