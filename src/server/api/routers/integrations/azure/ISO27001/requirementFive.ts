import type { ConditionalAccessPolicy } from "@microsoft/microsoft-graph-types";
import { ControlStatus } from "~/lib/types/controls";
import { evaluate } from "../../common";
import { listUserGroups, listUsers } from "../common";
import { initializeAzureClient } from "../init";

async function evaluateAccessControlLogs() {
  try {
    const users = await listUsers();
    // const groups = await listGroups();

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
      return ControlStatus.Enum.NOT_IMPLEMENTED;
    } else if (roleBasedImplemented && !leastPrivilegeImplemented) {
      return ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
    } else {
      return ControlStatus.Enum.FULLY_IMPLEMENTED;
    }
  } catch (error) {
    console.error("Error checking access control status:", error);
    throw error;
  }
}

async function evaluateMFAStatus() {
  try {
    // Fetch conditional access policies
    const azureClient = await initializeAzureClient();
    const policies = await azureClient
      .api("/policies/conditionalAccessPolicies")
      .get();

    console.log("policies:", policies);

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
    console.log("MFA policies:", mfaPolicies);

    if (mfaPolicies.length === 0) {
      return ControlStatus.Enum.NOT_IMPLEMENTED;
    }

    // Check if MFA is fully or partially implemented
    const partiallyImplemented = mfaPolicies.some(
      (policy: ConditionalAccessPolicy) =>
        !policy.state || policy.state === "disabled"
    );
    if (partiallyImplemented) {
      return ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
    }

    return ControlStatus.Enum.FULLY_IMPLEMENTED;
  } catch (error) {
    console.error("Error evaluateMFAStatus:", error);
    return null;
  }
}

async function getAccessControlEvidence() {
  return evaluate([evaluateAccessControlLogs, evaluateMFAStatus]);
}

export { getAccessControlEvidence };
