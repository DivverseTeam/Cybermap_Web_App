import { getRequirementFourStatus } from "../../../integrations/azure/ISO27001/requirementFour";
import { AzureAUth } from "../../../integrations/common";

export async function getAssetManagement(auth: AzureAUth) {
  console.log("Getting asset management....");
  return getRequirementFourStatus(auth);
}
