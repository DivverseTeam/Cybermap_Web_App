import { Client } from "@microsoft/microsoft-graph-client";
import type {
  AppRoleAssignment,
  RoleAssignment,
  ServicePrincipal,
} from "@microsoft/microsoft-graph-types";
import { ControlStatus } from "~/lib/types/controls";
import { AzureAUth, evaluate, saveEvidence } from "../../common";
import { initializeAzureClient } from "../init";

const SECURITY_ROLES = [
  "Security Reader",
  "Security Administrator",
  "Global Administrator",
];

async function getRoleAssignmentLogs(
  azureClient: Client
): Promise<{ value: RoleAssignment[] }> {
  const roleAssignments = await azureClient
    .api("/roleManagement/directory/roleAssignments")
    .get();
  return roleAssignments;
}

async function evaluateRoleAssignmentLogs({
  controlName,
  controlId,
  organisationId,
  azureClient,
}: {
  azureClient: Client;
  controlName: string;
  controlId: string;
  organisationId: string;
}) {
  // Fetch role assignments from Graph API
  const evd_name = `Role assignment logs`;
  const roleAssignments = await getRoleAssignmentLogs(azureClient);
  await saveEvidence({
    fileName: `Azure-${controlName}-${evd_name}`,
    body: { evidence: roleAssignments },
    controls: ["ISO27001-1"],
    controlId,
    organisationId,
  });

  // Extract role assignment information
  const roles = roleAssignments?.value || [];

  if (roles.length === 0) {
    return ControlStatus.Enum.NOT_IMPLEMENTED;
  }

  // Check if security-related roles exist
  const hasSecurityRoles = roles.some(
    (role) =>
      role.roleDefinition?.displayName &&
      SECURITY_ROLES.includes(role.roleDefinition.displayName)
  );

  if (hasSecurityRoles) {
    return roles.length > 3
      ? ControlStatus.Enum.FULLY_IMPLEMENTED
      : ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
  } else {
    return ControlStatus.Enum.NOT_IMPLEMENTED;
  }
}

async function getAllServicePrincipals(azureClient: Client): Promise<{
  value: ServicePrincipal[];
}> {
  const servicePrincipals = await azureClient.api("/servicePrincipals").get();
  return servicePrincipals;
}

async function evaluateThirdPartySecurityDocumentation({
  controlName,
  controlId,
  organisationId,
  azureClient,
}: {
  controlName: string;
  controlId: string;
  organisationId: string;
  azureClient: Client;
}) {
  const evd_name = `Third-party security agreements`;
  const servicePrincipals = await getAllServicePrincipals(azureClient);

  let documentedCount = 0;
  let undocumentedCount = 0;
  const servicePrincipalsRoleAssignments = [];

  for (const servicePrincipal of servicePrincipals.value) {
    const servicePrincipalId = servicePrincipal.id;

    // Fetch app role assignments for the service principal
    const appRoleAssignments: { value: AppRoleAssignment[] } = await azureClient
      .api(`/servicePrincipals/${servicePrincipalId}/appRoleAssignments`)
      .get();
    servicePrincipalsRoleAssignments.push({
      appRoleAssignments,
      servicePrincipalId,
    });

    // Determine if roles and responsibilities are documented
    if (appRoleAssignments.value.length > 0) {
      documentedCount++;
    } else {
      undocumentedCount++;
    }
  }

  await saveEvidence({
    fileName: `Azure-${controlName}-${evd_name}`,
    body: { evidence: servicePrincipalsRoleAssignments },
    controls: ["ISO27001-1"],
    controlId,
    organisationId,
  });

  // Return overall documentation status
  const total = servicePrincipals.value.length;
  if (documentedCount === total) {
    return ControlStatus.Enum.FULLY_IMPLEMENTED;
  } else if (undocumentedCount === total) {
    return ControlStatus.Enum.NOT_IMPLEMENTED;
  } else {
    return ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
  }
}

async function getOrganizationInformationSecurityEvidence({
  azureAd,
  controlId,
  controlName,
  organisationId,
}: AzureAUth) {
  if (!azureAd) throw new Error("Azure AD token is required");
  const azureClient = await initializeAzureClient(azureAd.token);
  const status = await evaluate(
    [
      () =>
        evaluateRoleAssignmentLogs({
          azureClient,
          controlId,
          controlName,
          organisationId,
        }),
      () =>
        evaluateThirdPartySecurityDocumentation({
          azureClient,
          controlId,
          controlName,
          organisationId,
        }),
    ],
    [azureAd.integrationId]
  );
  return status;
}

export { getOrganizationInformationSecurityEvidence };
