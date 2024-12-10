import { Client } from "@microsoft/microsoft-graph-client";
import type { ConditionalAccessPolicy } from "@microsoft/microsoft-graph-types";
import { ControlStatus } from "~/lib/types/controls";
import { AzureAUth, evaluate } from "../../common";
import { listUserGroups, listUsers } from "../common";
import { initializeAzureClient } from "../init";

async function evaluateAccessControlLogs(azureClient: Client) {
  const users = await listUsers(azureClient);
  // const groups = await listGroups();

  let roleBasedImplemented = false;
  let leastPrivilegeImplemented = true;

  for (const user of users.value) {
    if (!user.id) continue;
    // Get group membership for each user
    const userGroups = await listUserGroups(user.id, azureClient);

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
}

async function evaluateMFAStatus(azureClient: Client) {
  // Fetch conditional access policies
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
}

async function getAccessControlEvidence({ azureAd }: AzureAUth) {
  if (!azureAd) throw new Error("Azure AD token is required");
  const azureClient = await initializeAzureClient(azureAd.token);
  return evaluate([
    () => evaluateAccessControlLogs(azureClient),
    () => evaluateMFAStatus(azureClient),
  ]);
}

export { getAccessControlEvidence };
