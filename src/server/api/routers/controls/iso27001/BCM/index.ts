import { getRequirementTwelveStatus } from "../../../integrations/azure/ISO27001/requirementTwelve";
import { AzureAUth } from "../../../integrations/common";

export async function getBCM(auth: AzureAUth) {
  console.log(
    "Getting Information Security Aspects of Business Continuity Management.."
  );
  return getRequirementTwelveStatus(auth);
}
