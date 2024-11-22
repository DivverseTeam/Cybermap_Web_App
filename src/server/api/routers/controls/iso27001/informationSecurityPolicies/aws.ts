import { getInformationSecurityPolicyEvidence } from "../../../integrations/aws/ISO27001/requirementOne";

export async function getInformationSecurityPolicies() {
  console.log("Getting information security policies...");
  return await getInformationSecurityPolicyEvidence();
}
