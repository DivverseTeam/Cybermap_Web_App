import { getAccessControlEvidence } from "../../../integrations/azure/ISO27001/requirementFive";

export async function getAccessControl() {
  console.log("Getting access controls...");
  return await getAccessControlEvidence();
}
