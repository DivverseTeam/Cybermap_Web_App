import { getAccessControlEvidence } from "../../../integrations/azure/ISO27001/requirementFive";
import { AzureAUth } from "../../../integrations/common";

export async function getAccessControl(auth: AzureAUth) {
  console.log("Getting access controls...");
  return getAccessControlEvidence(auth);
}
