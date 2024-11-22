import { getHumanResourceSecurityEvidence } from "../../../integrations/azure/ISO27001/requirementThree";

export async function getHumanResourceSecurity() {
  console.log("Getting human Resource Security...");
  return await getHumanResourceSecurityEvidence();
}
