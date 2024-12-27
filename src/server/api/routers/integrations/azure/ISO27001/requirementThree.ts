// import { MonitorClient } from "@azure/arm-monitor";
import { Client } from "@microsoft/microsoft-graph-client";
import { DirectoryAudit } from "@microsoft/microsoft-graph-types";
import { ControlStatus } from "~/lib/types/controls";
import { AzureAUth, evaluate, saveEvidence } from "../../common";
import { getUserDetails, listUsers } from "../common";
import { initializeAzureClient } from "../init";

async function getTerminationLogs({
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
  try {
    const evd_name = `Termination logs`;
    // Fetch the audit logs for user lifecycle events
    const auditLogs: { value: DirectoryAudit[] } = await azureClient
      .api("/auditLogs/directoryAudits")
      .get();
    const { value } = auditLogs;

    await saveEvidence({
      fileName: `Azure-${controlName}-${evd_name}`,
      body: { evidence: auditLogs },
      controls: ["ISO27001-1"],
      controlId,
      organisationId,
    });

    // Process the logs to check for access revocation
    let accessRevokedCount = 0;
    let missingPoliciesCount = 0;

    if (value) {
      console.log("auditLogs", value);
      for (const log of value) {
        if (log.activityDisplayName === "Delete user") {
          if (log.result === "success") {
            accessRevokedCount++;
          } else {
            missingPoliciesCount++;
          }
        }
      }
    }

    // Determine the implementation status
    if (accessRevokedCount > 0 && missingPoliciesCount === 0) {
      return ControlStatus.Enum.FULLY_IMPLEMENTED;
    } else if (accessRevokedCount > 0 && missingPoliciesCount > 0) {
      return ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
    } else {
      return ControlStatus.Enum.NOT_IMPLEMENTED;
    }
  } catch (error) {
    throw error;
  }
}

async function getAccessManagementLogs({
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
  // Fetch all users
  const evd_name = `Access management logs`;
  const users = await listUsers(azureClient);

  if (!users || !users.value || users.value.length === 0) {
    return ControlStatus.Enum.NOT_IMPLEMENTED;
  }

  // Check for users who should be deactivated
  const inactiveUsers = [];
  const userDetailsArr = [];

  for (const user of users.value) {
    if (!user.id) continue;
    // Get the user details
    const userDetails = await getUserDetails(user.id, azureClient);
    userDetailsArr.push(userDetails);

    // Check if the user is inactive
    const { accountEnabled = false, signInActivity } = userDetails.value || {};
    const lastSignInDate = signInActivity?.lastSignInDateTime ?? null;
    if (!accountEnabled || !lastSignInDate) {
      inactiveUsers.push(user);
    }
  }

  await saveEvidence({
    fileName: `Azure-${controlName}-${evd_name}`,
    body: { evidence: userDetailsArr },
    controls: ["ISO27001-1"],
    controlId,
    organisationId,
  });

  // Determine the status based on the findings
  if (inactiveUsers.length === 0) {
    return ControlStatus.Enum.FULLY_IMPLEMENTED;
  } else if (inactiveUsers.length < users.value.length) {
    return ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
  } else {
    return ControlStatus.Enum.NOT_IMPLEMENTED;
  }
}

async function getHumanResourceSecurityEvidence({
  azureAd,
  controlId,
  organisationId,
  controlName,
}: AzureAUth) {
  if (!azureAd) throw new Error("Azure AD token is required");
  const azureClient = await initializeAzureClient(azureAd.token);

  return evaluate(
    [
      () =>
        getAccessManagementLogs({
          azureClient,
          controlId,
          controlName,
          organisationId,
        }),
      () =>
        getTerminationLogs({
          azureClient,
          controlId,
          controlName,
          organisationId,
        }),
    ],
    [azureAd.integrationId]
  );
}

export { getHumanResourceSecurityEvidence };
