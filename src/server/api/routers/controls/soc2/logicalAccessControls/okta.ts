import { getAccessControlEvidence } from "../../../integrations/okta/SOC2/requirementOne";

export async function getLogicalAccessControls() {
  await getAccessControlEvidence();
}
