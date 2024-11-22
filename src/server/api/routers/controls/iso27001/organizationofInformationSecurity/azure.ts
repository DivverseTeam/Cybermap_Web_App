import { getOrganizationInformationSecurityEvidence } from "../../../integrations/azure/ISO27001/requirementTwo";

export async function getOrganizationOfInformationSecurity() {
  console.log("Getting organization of InformationSecurity...");
  return await getOrganizationInformationSecurityEvidence();
}
