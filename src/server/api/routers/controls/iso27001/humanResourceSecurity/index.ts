import { getHumanResourceSecurityEvidence } from "../../../integrations/azure/ISO27001/requirementThree";
import { AzureAUth } from "../../../integrations/common";

export async function getHumanResourceSecurity(auth: AzureAUth) {
  console.log("Getting human Resource Security...");
  return getHumanResourceSecurityEvidence(auth);
}
