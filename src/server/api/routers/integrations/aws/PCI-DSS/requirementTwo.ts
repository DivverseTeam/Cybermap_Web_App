// Do not use vendor-supplied defaults for system passwords and other security parameters

import {
  ConfigRule,
  DescribeConfigRulesCommand,
} from "@aws-sdk/client-config-service";
import { configServiceClient, secretsManagerClient } from "../init";
import { GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

// 1. Function to retrieve configuration rules from AWS Config
async function getConfigRules() {
  try {
    const command = new DescribeConfigRulesCommand({});
    const data = await configServiceClient.send(command);
    if (!data.ConfigRules) return [];

    // Filter rules related to default configurations if needed
    const configRules = data.ConfigRules.filter((rule) => {
      return rule.Scope && rule.Scope.TagKey !== "default"; // Example filter, adjust based on criteria
    });

    return configRules;
  } catch (error) {
    console.error("Error retrieving Config Rules:", error);
  }
}

// 2. Function to retrieve secret values from AWS Secrets Manager
async function getSecretDetails(secretId: string) {
  try {
    const params = { SecretId: secretId };
    const command = new GetSecretValueCommand(params);
    const data = await secretsManagerClient.send(command);

    // Check for non-default values in secrets if needed
    const secretValue = data.SecretString;
    const isDefault = checkIfDefault(secretValue); // Implement `checkIfDefault` as needed

    return {
      success: true,
      data: { secretId, isDefault },
    };
  } catch (error) {
    console.log(`Error retrieving secret ${secretId}:`, error);
  }
}

// 3. Function to simulate checking default settings in AWS Config and Secrets Manager
async function auditConfigurationsAndSecrets() {
  const results: {
    configAudit: ConfigRule[];
    secretAudit: any[];
  } = {
    configAudit: [],
    secretAudit: [],
  };

  // Configuration audits via AWS Config
  const configAuditResult = await getConfigRules();
  results.configAudit = configAuditResult || [];

  // Secret management audits via AWS Secrets Manager (example list of secret IDs)
  const secretIds = ["mySecret1", "mySecret2"]; // Replace with actual secret IDs
  const secretAuditResults = await Promise.all(secretIds.map(getSecretDetails));
  results.secretAudit = secretAuditResults;

  return results;
}

// Helper function to check if secret contains default settings (for demonstration)
function checkIfDefault(secretValue: any) {
  // Placeholder logic; customize as per your definition of "default"
  return secretValue.password === "defaultPassword";
}

export async function getEvidence() { 
  return await auditConfigurationsAndSecrets();
}
