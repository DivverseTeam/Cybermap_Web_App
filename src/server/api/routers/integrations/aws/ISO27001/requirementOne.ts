import {
  DescribeConfigRulesCommand,
  GetComplianceDetailsByConfigRuleCommand,
} from "@aws-sdk/client-config-service";
import { configServiceClient } from "../init";
import {
  getAllConfigRulesResponse,
  getComplianceDetailsByConfigRuleResponse,
} from "./constants";

// Security policy documentation - Fetches security policy details
async function getSecurityPolicyDocumentation() {
  return "";
}

// Change logs - Retrieves logs related to policy updates and reviews
async function getPolicyChangeLogs() {
  return "";
}

const getAllConfigRules = async () => {
  try {
    const ruleNames = [];
    let nextToken;

    do {
      const command = new DescribeConfigRulesCommand({ NextToken: nextToken });
      const response = await configServiceClient.send(command);
      console.log("Config rules:", response.ConfigRules);
      if (response.ConfigRules) {
        ruleNames.push(
          ...response.ConfigRules.map((rule) => rule.ConfigRuleName)
        );
      }

      nextToken = response.NextToken; // Check if there's another page of results
    } while (nextToken);

    return ruleNames;
    // return getAllConfigRulesResponse.map((rule) => rule.ConfigRuleName);
  } catch (error) {
    console.error("Error fetching Config rule names:", error);
    throw error;
  }
};

// AWS Config Compliance Check - Retrieves compliance details for a specified AWS Config rule
async function getComplianceDetailsByConfigRule() {
  try {
    const ruleNames = await getAllConfigRules();
    console.log("Rule names:", ruleNames);
    // return getComplianceDetailsByConfigRuleResponse;
    const results = [];
    for (const ruleName of ruleNames) {
      const command = new GetComplianceDetailsByConfigRuleCommand({
        ConfigRuleName: ruleName,
      });
      const response = await configServiceClient.send(command);
      results.push({
        ruleName,
        evaluations: response.EvaluationResults, // Compliance evaluations for the specified rule
      });
    }
    console.log("Compliance details:", results);
    return results;
  } catch (error) {
    console.error("Error fetching compliance details:", error);
    throw error;
  }
}

function evaluate(configRulesData: any[]) {
 const totalRules = configRulesData.length;

 if (totalRules === 0) {
   return "Not implemented";
 }

 let fullyImplemented = 0;
 let partiallyImplemented = 0;
 let notImplemented = 0;

 configRulesData.forEach((rule) => {
   const evaluations = rule.evaluations;
   const compliantResources = evaluations.filter(
     (evaluation) => evaluation.ComplianceType === "COMPLIANT"
   ).length;
   const nonCompliantResources = evaluations.filter(
     (evaluation) => evaluation.ComplianceType === "NON_COMPLIANT"
   ).length;

   if (compliantResources > 0 && nonCompliantResources === 0) {
     fullyImplemented++;
   } else if (compliantResources > 0 && nonCompliantResources > 0) {
     partiallyImplemented++;
   } else {
     notImplemented++;
   }
 });

 if (fullyImplemented === totalRules) {
   return "Fully implemented";
 } else if (notImplemented === totalRules) {
   return "Not implemented";
 } else {
   return "Partially implemented";
 }
}

async function getInformationSecurityPolicyEvidence() {
  try {
    const configRulesData = await getComplianceDetailsByConfigRule();
    return evaluate(configRulesData);
  } catch (error) {
    console.error("Error fetching login and activity logs:", error);
    return null;
  }
}

export { getInformationSecurityPolicyEvidence };
