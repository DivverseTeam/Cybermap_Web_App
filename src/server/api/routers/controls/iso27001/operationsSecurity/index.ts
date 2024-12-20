import { getRequirementEightStatus } from "../../../integrations/azure/ISO27001/requirementEight";
import { AzureAUth } from "../../../integrations/common";

export async function getOperationsSecurity(auth: AzureAUth) {
  console.log("Getting OperationsSecurity...");
  return getRequirementEightStatus(auth);
}
