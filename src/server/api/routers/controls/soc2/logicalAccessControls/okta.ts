import { getAccessControlEvidence } from "../../../integrations/okta/SOC2";

export async function getLogicalAccessControls() {
  await getAccessControlEvidence();
}
