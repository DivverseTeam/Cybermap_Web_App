import {
  getBackupEncryptionEvidence,
  getBackupScheduleEvidence,
  getDisasterRecoveryTestResults,
} from "../../../integrations/aws/SOC2/requirementThree";

async function getBackupAndDisasterRecovery() {
  await getBackupEncryptionEvidence();
  await getBackupScheduleEvidence();
  await getDisasterRecoveryTestResults();
}
