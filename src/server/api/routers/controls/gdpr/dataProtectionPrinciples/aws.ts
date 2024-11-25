import { getDataProtectionPrinciplesEvidence } from "../../../integrations/aws/GDPR/requirementOne";

async function getDataProtectionPrinciples() {
  await getDataProtectionPrinciplesEvidence();
}
