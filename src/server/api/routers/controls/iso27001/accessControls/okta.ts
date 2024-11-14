import { getAccessControlEvidence } from "../../../integrations/okta/ISO27001";

export async function getAccessControls() {
  await getAccessControlEvidence();
}
