// import { MonitorClient } from "@azure/arm-monitor";
import { Client } from "@microsoft/microsoft-graph-client";
import { ControlStatus } from "~/lib/types/controls";
import { AzureAUth, evaluate } from "../../common";
import { getUserDetails, listUsers } from "../common";
import { initializeAzureClient } from "../init";

// async function getTerminationLogs(monitorClient: MonitorClient) {
//   try {
//     const logQuery = `
//     SecurityEvent
//     | where EventID == 4720 or EventID == 4726 // Employment ended or access revoked
//     | project TimeGenerated, UserId, EventID
//   `; // Example KQL query

//     const queryResult = await monitorClient.query.resources.execute({
//       query: logQuery,
//       timespan: "P30D", // Example: last 30 days
//     });

//     if (!queryResult.tables || queryResult.tables.length === 0) {
//       return "Not Implemented"; // No relevant logs found
//     }

//     const table = queryResult.tables[0];
//     const accessRevokedRecords = table.rows.filter((row) =>
//       row.includes("AccessRevoked")
//     );
//     const employmentEndRecords = table.rows.filter((row) =>
//       row.includes("EmploymentEnded")
//     );

//     if (employmentEndRecords.length === 0) {
//       return "Not Implemented"; // No employment end events found
//     }

//     const matchedRecords = employmentEndRecords.filter((endEvent) =>
//       accessRevokedRecords.some(
//         (revokeEvent) => revokeEvent.userId === endEvent.userId
//       )
//     );

//     if (matchedRecords.length === 0) {
//       return "Not Implemented"; // No matches for revoked access after employment end
//     }

//     if (matchedRecords.length < employmentEndRecords.length) {
//       return "Partially Implemented"; // Some matches found
//     }

//     return "Fully Implemented"; // All matches found
//   } catch (error) {
//     console.error("Error auditing HR Security requirements:", error);
//     throw new Error("Failed to audit HR Security requirements");
//   }
// }

async function getAccessManagementLogs(azureClient: Client) {
  // Fetch all users
  const users = await listUsers(azureClient);
  console.log("Users:", users);

  if (!users || !users.value || users.value.length === 0) {
    return ControlStatus.Enum.NOT_IMPLEMENTED;
  }

  // Check for users who should be deactivated
  const inactiveUsers = [];

  for (const user of users.value) {
    if (!user.id) continue;
    // Get the user details
    const userDetails = await getUserDetails(user.id, azureClient);
    console.log("User details:", userDetails);

    // console.log("User details:", userDetails);

    // Check if the user is inactive
    const { accountEnabled = false, signInActivity } = userDetails.value || {};
    const lastSignInDate = signInActivity?.lastSignInDateTime ?? null;
    if (!accountEnabled || !lastSignInDate) {
      inactiveUsers.push(user);
    }
  }

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
  azureCloud,
}: AzureAUth) {
  console.log("getOrganizationInformationSecurityEvidence...");
  if (!azureAd) throw new Error("Azure AD token is required");
  const azureClient = await initializeAzureClient(azureAd.token);
  // if (!azureCloud) throw new Error("Azure cloud is required");
  // const { credential, subscriptionId } = getCredentials(azureCloud);
  // const monitorClient = new MonitorClient(credential, subscriptionId);
  
  // PENDING - Termination logs
  return evaluate([
    () => getAccessManagementLogs(azureClient),
    // () => getTerminationLogs(monitorClient),
  ]);
}

export { getHumanResourceSecurityEvidence };
