import { getRequirementOneStatus } from "../../../integrations/azure/ISO27001/requirementOne";
import { AzureAUth } from "../../../integrations/common";

export async function getInformationSecurityPolicies(auth: AzureAUth) {
  console.log("Getting information security policies...");
  return getRequirementOneStatus(auth);
}
