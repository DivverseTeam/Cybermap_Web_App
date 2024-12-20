import { getRequirementNineStatus } from "../../../integrations/azure/ISO27001/requirementNine";
import { AzureAUth } from "../../../integrations/common";

export async function getCommunicationsSecurity(auth: AzureAUth) {
  console.log("Getting physicalEnvironmentalSecurity...");
  return getRequirementNineStatus(auth);
}
