import { getRequirementElevenStatus } from "../../../integrations/azure/ISO27001/requirementEleven";
import { AzureAUth } from "../../../integrations/common";

export async function getInformationSecurityIncidentManagement(auth: AzureAUth) {
  console.log("Getting Information Security Incident Management...");
  return getRequirementElevenStatus(auth);
}
