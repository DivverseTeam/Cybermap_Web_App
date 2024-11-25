import {
  getDeletionAndArchivalLogsEvidence,
  getRetentionPolicyEvidence,
} from "../../../integrations/aws/SOC2/requirementFive";

async function getDataRetentionAndDisposal() {
  await getDeletionAndArchivalLogsEvidence();
  await getRetentionPolicyEvidence();
}
