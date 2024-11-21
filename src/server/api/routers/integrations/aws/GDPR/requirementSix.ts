import {
  GetComplianceSummaryByConfigRuleCommand,
} from "@aws-sdk/client-config-service";
import { ListPoliciesCommand } from "@aws-sdk/client-iam";
import { configServiceClient, iamClient } from "../init";

/**
 * Function to get configuration logs.
 * Evidence: Configuration logs showing that systems are configured with the highest privacy settings.
 */
const getConfigurationLogs = async () => {
  try {
    const command = new GetComplianceSummaryByConfigRuleCommand({});
    const response = await configServiceClient.send(command);
    console.log("Configuration Logs:", response);
    return response;
  } catch (error) {
    console.error("Error getting configuration logs:", error);
    throw error;
  }
};

/**
 * Function to get policy enforcement logs.
 * Evidence: Policy enforcement logs indicating that data minimization is applied by default.
 */
const getPolicyEnforcementLogs = async () => {
  try {
    const command = new ListPoliciesCommand({ Scope: "Local" });
    const response = await iamClient.send(command);
    console.log("Policy Enforcement Logs:", response);
    return response;
  } catch (error) {
    console.error("Error getting policy enforcement logs:", error);
    throw error;
  }
};
