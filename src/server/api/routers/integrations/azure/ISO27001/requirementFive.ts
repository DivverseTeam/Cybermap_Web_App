import type {
  ConditionalAccessPolicy,
} from "@microsoft/microsoft-graph-types";
import { CONTROL_STATUS_ENUM } from "~/lib/constants/controls";
import { azureClient } from "../init";
import { listUsers, listGroups, listUserGroups } from "../common";

async function evaluateAccessControlLogs() {
  try {
    const users = await listUsers();
    const groups = await listGroups();

    let roleBasedImplemented = false;
    let leastPrivilegeImplemented = true;

    for (const user of users.value) {
      if (!user.id) continue;
      // Get group membership for each user
      const userGroups = await listUserGroups(user.id);

      // Check if the user is part of any critical resource group
      const hasCriticalAccess = userGroups.value.some(
        (group) =>
          group.displayName &&
          group.displayName.toLowerCase().includes("critical")
      );

      if (hasCriticalAccess) {
        roleBasedImplemented = true;

        // Check if least privilege is enforced (example condition)
        if (user.assignedLicenses && user.assignedLicenses.length > 1) {
          leastPrivilegeImplemented = false;
        }
      }
    }

    // Determine the status based on findings
    if (!roleBasedImplemented) {
      return CONTROL_STATUS_ENUM.NOT_IMPLEMENTED;
    } else if (roleBasedImplemented && !leastPrivilegeImplemented) {
      return CONTROL_STATUS_ENUM.PARTIALLY_IMPLEMENTED;
    } else {
      return CONTROL_STATUS_ENUM.FULLY_IMPLEMENTED;
    }
  } catch (error) {
    console.error("Error checking access control status:", error);
    throw error;
  }
}

async function evaluateMFAStatus() {
  try {
    // Fetch conditional access policies
    const policies = await azureClient
      .api("/policies/conditionalAccessPolicies")
      .get();

    // Filter policies related to MFA enforcement
    const mfaPolicies = policies.value.filter(
      (policy: ConditionalAccessPolicy) => {
        return (
          policy.conditions &&
          policy.grantControls &&
          policy.grantControls.builtInControls &&
          policy.grantControls.builtInControls.includes("mfa")
        );
      }
    );

    if (mfaPolicies.length === 0) {
      return CONTROL_STATUS_ENUM.NOT_IMPLEMENTED;
    }

    // Check if MFA is fully or partially implemented
    const partiallyImplemented = mfaPolicies.some(
      (policy: ConditionalAccessPolicy) =>
        !policy.state || policy.state === "disabled"
    );
    if (partiallyImplemented) {
      return CONTROL_STATUS_ENUM.PARTIALLY_IMPLEMENTED;
    }

    return CONTROL_STATUS_ENUM.FULLY_IMPLEMENTED;
  } catch (error) {
    console.error("Error fetching policies:", error);
    throw new Error("Unable to fetch or process policies.");
  }
}

async function evaluate() {
  try {
    const accessControlStatus = await evaluateAccessControlLogs();
    const mfaStatus = await evaluateMFAStatus();

    if (
      accessControlStatus === CONTROL_STATUS_ENUM.FULLY_IMPLEMENTED &&
      mfaStatus === CONTROL_STATUS_ENUM.FULLY_IMPLEMENTED
    ) {
      return CONTROL_STATUS_ENUM.FULLY_IMPLEMENTED; // Both are fully implemented
    } else if (
      accessControlStatus === CONTROL_STATUS_ENUM.NOT_IMPLEMENTED ||
      mfaStatus === CONTROL_STATUS_ENUM.NOT_IMPLEMENTED
    ) {
      return CONTROL_STATUS_ENUM.NOT_IMPLEMENTED; // At least one is not implemented
    } else {
      return CONTROL_STATUS_ENUM.PARTIALLY_IMPLEMENTED; // One or both are partially implemented
    }
  } catch (error) {
    console.error("Error evaluating compliance:", error);
    throw error; // Re-throw error to propagate it further
  }
}

async function getAccessControlEvidence() {
  return evaluate();
}

export { getAccessControlEvidence };
