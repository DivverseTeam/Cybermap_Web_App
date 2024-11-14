import {
  getCertManagementLogsEvidence,
  getEncryptionPoliciesEvidence,
  getKeyRotationEvidence,
} from "../../../integrations/aws/SOC2/requirementTwo";

export async function getEncryption() {
  await getCertManagementLogsEvidence();
  await getEncryptionPoliciesEvidence();
  await getKeyRotationEvidence();
}
