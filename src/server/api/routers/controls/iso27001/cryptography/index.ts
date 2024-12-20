import { getRequirementSixStatus } from "../../../integrations/azure/ISO27001/requirementSix";
import { AzureAUth } from "../../../integrations/common";

export async function getCryptography(auth: AzureAUth) {
  console.log("Getting Cryptography...");
  return getRequirementSixStatus(auth);
}
