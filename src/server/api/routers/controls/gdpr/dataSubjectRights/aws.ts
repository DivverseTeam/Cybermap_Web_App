import { getDataSubjectRightsEvidence } from "../../../integrations/aws/GDPR/requirementThree";

async function getDataSubjectRights() {
  await getDataSubjectRightsEvidence();
}
