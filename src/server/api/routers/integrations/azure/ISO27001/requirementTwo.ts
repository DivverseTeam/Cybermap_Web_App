import type {
  AppRoleAssignment,
  RoleAssignment,
  ServicePrincipal,
} from "@microsoft/microsoft-graph-types";
import { CONTROL_STATUS_ENUM } from "~/lib/constants/controls";
import { azureClient } from "../init";

const SECURITY_ROLES = [
  "Security Reader",
  "Security Administrator",
  "Global Administrator",
];

async function getRoleAssignmentLogs(): Promise<{ value: RoleAssignment[] }> {
  const roleAssignments = await azureClient
    .api("/roleManagement/directory/roleAssignments")
    .get();
  return roleAssignments;
}

async function evaluateRoleAssignmentLogs() {
  try {
    // Fetch role assignments from Graph API
    const roleAssignments = await getRoleAssignmentLogs();

    // Extract role assignment information
    const roles = roleAssignments?.value || [];

    if (roles.length === 0) {
      return CONTROL_STATUS_ENUM.NOT_IMPLEMENTED;
    }

    // Check if security-related roles exist
    const hasSecurityRoles = roles.some(
      (role) =>
        role.roleDefinition?.displayName &&
        SECURITY_ROLES.includes(role.roleDefinition.displayName)
    );

    if (hasSecurityRoles) {
      return roles.length > 3
        ? CONTROL_STATUS_ENUM.FULLY_IMPLEMENTED
        : CONTROL_STATUS_ENUM.PARTIALLY_IMPLEMENTED;
    } else {
      return CONTROL_STATUS_ENUM.NOT_IMPLEMENTED;
    }
  } catch (error) {
    console.error("Error fetching role assignments:", error);
    throw new Error("Failed to evaluate access control status");
  }
}

async function getAllServicePrincipals(): Promise<{
  value: ServicePrincipal[];
}> {
  const servicePrincipals = await azureClient.api("/servicePrincipals").get();
  return servicePrincipals;
}

async function evaluateThirdPartySecurityDocumentation() {
  try {
    const servicePrincipals = await getAllServicePrincipals();

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
      return CONTROL_STATUS_ENUM.FULLY_IMPLEMENTED;
    } else if (undocumentedCount === total) {
      return CONTROL_STATUS_ENUM.NOT_IMPLEMENTED;
    } else {
      return CONTROL_STATUS_ENUM.PARTIALLY_IMPLEMENTED;
    }
  } catch (error) {
    console.error(
      "Error evaluating third-party security documentation:",
      error
    );
    throw new Error("Failed to evaluate third-party security documentation.");
  }
}

async function evaluate() {
  try {
    const roleAssignmentStatus = await evaluateRoleAssignmentLogs();
    const thirdPartyDocumentationStatus =
      await evaluateThirdPartySecurityDocumentation();

    if (
      roleAssignmentStatus === CONTROL_STATUS_ENUM.FULLY_IMPLEMENTED &&
      thirdPartyDocumentationStatus === CONTROL_STATUS_ENUM.FULLY_IMPLEMENTED
    ) {
      return CONTROL_STATUS_ENUM.FULLY_IMPLEMENTED;
    } else if (
      roleAssignmentStatus === CONTROL_STATUS_ENUM.NOT_IMPLEMENTED ||
      thirdPartyDocumentationStatus === CONTROL_STATUS_ENUM.NOT_IMPLEMENTED
    ) {
      return CONTROL_STATUS_ENUM.NOT_IMPLEMENTED;
    } else {
      return CONTROL_STATUS_ENUM.PARTIALLY_IMPLEMENTED;
    }
  } catch (error) {
    console.error("Error evaluating access control status:", error);
    throw error;
  }
}

async function getOrganizationInformationSecurityEvidence() {
  return evaluate();
}

export { getOrganizationInformationSecurityEvidence };
