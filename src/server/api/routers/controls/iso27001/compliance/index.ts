import { getRequirementThirteenStatus } from "../../../integrations/azure/ISO27001/requirementThirteen";
import { AzureAUth } from "../../../integrations/common";

export async function getCompliance(auth: AzureAUth) {
  console.log("Getting compliance..");
  return getRequirementThirteenStatus(auth);
}
