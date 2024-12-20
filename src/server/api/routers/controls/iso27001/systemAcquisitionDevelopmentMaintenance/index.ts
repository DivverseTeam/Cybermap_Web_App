import { getRequirementTenStatus } from "../../../integrations/azure/ISO27001/requirementTen";
import { AzureAUth } from "../../../integrations/common";

export async function getSystemAcquisitionDevelopmentMaintenance(
  auth: AzureAUth
) {
  console.log("Getting SystemAcquisitionDevelopmentMaintenance...");
  return getRequirementTenStatus(auth);
}
