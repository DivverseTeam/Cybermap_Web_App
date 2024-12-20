import { getRequirementSevenStatus } from "../../../integrations/azure/ISO27001/requirementSeven";
import { AzureAUth } from "../../../integrations/common";

export async function getPhysicalEnvironmentalSecurity(auth: AzureAUth) {
  console.log("Getting physicalEnvironmentalSecurity...");
  return getRequirementSevenStatus(auth);
}
