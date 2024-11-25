import {
  getIAMConfigurationsAndPoliciesEvidence,
  getMFAEnforcementEvidence,
  getLoginAndActivityLogsEvidence,
} from "../../../integrations/aws/SOC2/requirementOne";

export async function getLogicalAccessControls() {
  await getIAMConfigurationsAndPoliciesEvidence();
  await getMFAEnforcementEvidence();
  await getLoginAndActivityLogsEvidence();
}
