import {
    LookupEventsCommand
} from "@aws-sdk/client-cloudtrail";
import {
    GetComplianceDetailsByConfigRuleCommand
} from "@aws-sdk/client-config-service";
import {
    DescribeKeyCommand,
    ListKeysCommand
} from "@aws-sdk/client-kms";
import { cloudTrailClient, configServiceClient, kmsClient } from "../init";


/**
 * Data processing logs: Logs user activities to show how personal data is accessed or modified.
 * Evidence: CloudTrail logs for data processing activities.
 */
export const getDataProcessingLogs = async () => {
  const command = new LookupEventsCommand({});
  try {
    const response = await cloudTrailClient.send(command);
    return response.Events; // Contains details of API activity
  } catch (error) {
    console.error("Error fetching CloudTrail events:", error);
    throw error;
  }
};

/**
 * Data retention policies: Validates whether data retention and minimization rules are enforced.
 * Evidence: AWS Config compliance details.
 */
export const getDataRetentionCompliance = async (ruleName: string) => {
  const command = new GetComplianceDetailsByConfigRuleCommand({
    ConfigRuleName: ruleName,
  });
  try {
    const response = await configServiceClient.send(command);
    return response.EvaluationResults; // Compliance evaluations for the specified rule
  } catch (error) {
    console.error("Error fetching compliance details:", error);
    throw error;
  }
};

/**
 * Encryption logs: Retrieves and validates encryption keys used for securing personal data.
 * Evidence: Details of encryption keys from KMS.
 */
export const getEncryptionKeys = async () => {
  try {
    const listKeysCommand = new ListKeysCommand({});
      const keys = await kmsClient.send(listKeysCommand);
      if(!keys.Keys) return [];

    const keyDetails = await Promise.all(
      keys.Keys.map(async (key) => {
        const describeKeyCommand = new DescribeKeyCommand({ KeyId: key.KeyId });
        return kmsClient.send(describeKeyCommand);
      })
    );

    return keyDetails; // List of encryption keys with details
  } catch (error) {
    console.error("Error fetching KMS keys:", error);
    throw error;
  }
};

/**
 * Access control policies: Ensures access to data is restricted to authorized individuals.
 * Evidence: AWS Config rule compliance for access control policies.
 */
export const getAccessControlCompliance = async (ruleName: string) => {
  const command = new GetComplianceDetailsByConfigRuleCommand({
    ConfigRuleName: ruleName,
  });
  try {
    const response = await configServiceClient.send(command);
    return response.EvaluationResults; // Access control compliance data
  } catch (error) {
    console.error("Error fetching access control compliance:", error);
    throw error;
  }
};
