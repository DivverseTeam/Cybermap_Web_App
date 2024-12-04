import { getOrganizationInformationSecurityEvidence } from "../../../integrations/azure/ISO27001/requirementTwo";
import { AzureAUth } from "../../../integrations/common";

export async function getOrganizationOfInformationSecurity(auth: AzureAUth) {
  console.log("Getting organization of InformationSecurity...");
  return await getOrganizationInformationSecurityEvidence(auth);
}
