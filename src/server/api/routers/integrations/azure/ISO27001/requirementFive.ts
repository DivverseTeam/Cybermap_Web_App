import { Client } from "@microsoft/microsoft-graph-client";
import type { ConditionalAccessPolicy } from "@microsoft/microsoft-graph-types";
import { ControlStatus } from "~/lib/types/controls";
import { AzureAUth, evaluate, saveEvidence } from "../../common";
import { listUserGroups, listUsers } from "../common";
import { initializeAzureClient } from "../init";

async function evaluateAccessControlLogs({
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
  const evd_name = `Access control logs`;
  const evidence: any = {};
  const users = await listUsers(azureClient);
  // const groups = await listGroups();

  let roleBasedImplemented = false;
  let leastPrivilegeImplemented = true;

  for (const user of users.value) {
    if (!user.id) continue;
    // Get group membership for each user
    const userGroups = await listUserGroups(user.id, azureClient);
    evidence[user.id] = userGroups.value;

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

  await saveEvidence({
    fileName: `Azure-${controlName}-${evd_name}`,
    body: { evidence },
    controls: ["ISO27001-1"],
    controlId,
    organisationId,
  });

  // Determine the status based on findings
  if (!roleBasedImplemented) {
    return ControlStatus.Enum.NOT_IMPLEMENTED;
  } else if (roleBasedImplemented && !leastPrivilegeImplemented) {
    return ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
  } else {
    return ControlStatus.Enum.FULLY_IMPLEMENTED;
  }
}

async function evaluateMFAStatus({
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
  // Fetch conditional access policies
  const evd_name = `MFA enforcement logs`;
  const policies = await azureClient
    .api("/policies/conditionalAccessPolicies")
    .get();

  console.log("policies:", policies);
  await saveEvidence({
    fileName: `Azure-${controlName}-${evd_name}`,
    body: { evidence: policies.value },
    controls: ["ISO27001-1"],
    controlId,
    organisationId,
  });

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

async function getAccessControlEvidence({
  azureAd,
  controlName,
  controlId,
  organisationId,
}: AzureAUth) {
  if (!azureAd) throw new Error("Azure AD token is required");
  const azureClient = await initializeAzureClient(azureAd.token);
  return evaluate([
    () =>
      evaluateAccessControlLogs({
        azureClient,
        controlName,
        controlId,
        organisationId,
      }),
    () =>
      evaluateMFAStatus({
        azureClient,
        controlName,
        controlId,
        organisationId,
      }),
  ]);
}

export { getAccessControlEvidence };
