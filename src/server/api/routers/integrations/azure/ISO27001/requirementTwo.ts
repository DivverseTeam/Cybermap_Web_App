import { Client } from "@microsoft/microsoft-graph-client";
import type {
  AppRoleAssignment,
  RoleAssignment,
  ServicePrincipal,
} from "@microsoft/microsoft-graph-types";
import { ControlStatus } from "~/lib/types/controls";
import { AzureAUth, evaluate } from "../../common";
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

async function evaluateRoleAssignmentLogs(azureClient: Client) {
  try {
    // Fetch role assignments from Graph API
    const roleAssignments = await getRoleAssignmentLogs(azureClient);
    console.log("roleAssignments", roleAssignments);

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
  } catch (error) {
    console.error("Error fetching role assignments:", error);
    return null;
    // throw new Error("Failed to evaluate access control status");
  }
}

async function getAllServicePrincipals(azureClient: Client): Promise<{
  value: ServicePrincipal[];
}> {
  const servicePrincipals = await azureClient.api("/servicePrincipals").get();
  return servicePrincipals;
}

async function evaluateThirdPartySecurityDocumentation(azureClient: Client) {
  try {
    const servicePrincipals = await getAllServicePrincipals(azureClient);

    let documentedCount = 0;
    let undocumentedCount = 0;

    for (const servicePrincipal of servicePrincipals.value) {
      const servicePrincipalId = servicePrincipal.id;

      // Fetch app role assignments for the service principal
      const appRoleAssignments: { value: AppRoleAssignment[] } =
        await azureClient
          .api(`/servicePrincipals/${servicePrincipalId}/appRoleAssignments`)
          .get();

      // Determine if roles and responsibilities are documented
      if (appRoleAssignments.value.length > 0) {
        documentedCount++;
      } else {
        undocumentedCount++;
      }
    }

    // Return overall documentation status
    const total = servicePrincipals.value.length;
    if (documentedCount === total) {
      return ControlStatus.Enum.FULLY_IMPLEMENTED;
    } else if (undocumentedCount === total) {
      return ControlStatus.Enum.NOT_IMPLEMENTED;
    } else {
      return ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
    }
  } catch (error) {
    console.error(
      "Error evaluating third-party security documentation:",
      error
    );
    // throw new Error("Failed to evaluate third-party security documentation.");
    return null;
  }
}

async function getOrganizationInformationSecurityEvidence({
  azureAd,
}: AzureAUth) {
  console.log("getOrganizationInformationSecurityEvidence...");
  if (!azureAd) throw new Error("Azure AD token is required");
  const azureClient = await initializeAzureClient(azureAd.token);
  const status = await evaluate([
    () => evaluateRoleAssignmentLogs(azureClient),
    () => evaluateThirdPartySecurityDocumentation(azureClient),
  ]);
  return status;
}

export { getOrganizationInformationSecurityEvidence };
