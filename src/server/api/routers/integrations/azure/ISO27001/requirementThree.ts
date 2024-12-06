import { Client } from "@microsoft/microsoft-graph-client";
import { ControlStatus } from "~/lib/types/controls";
import { AzureAUth, evaluate } from "../../common";
import { getUserDetails, listUsers } from "../common";
import { initializeAzureClient } from "../init";

// async function getTerminationLogs(workspaceId: string) {
//   const query = `
//     let userAccessLogs = AuditLogs
//     | where TimeGenerated > ago(90d)
//     | where ActivityDisplayName == "Add user" or ActivityDisplayName == "Remove user";

//     let deactivationLogs = SignInLogs
//     | where ResultType == "0"  // Successful sign-ins
//     | summarize LastSignIn=max(TimeGenerated) by UserPrincipalName;

//     let terminatedUsers = IdentityInfo
//     | where IsTerminated == true;  // Replace with your actual termination field

//     userAccessLogs
//     | join kind=leftouter (terminatedUsers) on $left.UserPrincipalName == $right.UserPrincipalName
//     | join kind=leftouter (deactivationLogs) on $left.UserPrincipalName == $right.UserPrincipalName
//     | project UserPrincipalName, LastSignIn, IsTerminated
//     | extend Status = iff(isnull(LastSignIn) and IsTerminated, "Not implemented", 
//                           iff(LastSignIn < EndDate and IsTerminated, "Partially implemented", "Fully implemented"))
//     | summarize StatusCount=count() by Status;
//   `;

//   try {
//     const result: any = await logsQueryClient.queryWorkspace(
//       workspaceId,
//       query,
//       {
//         duration: "P7D",
//       }
//     );

//     if (
//       result.tables &&
//       result.status === "Success" &&
//       result.tables.length > 0
//     ) {
//       const statusResults = result.tables[0].rows;
//       let finalStatus: ControlStatus = ControlStatus.Enum.NOT_IMPLEMENTED;

//       // Analyzing overall data for conclusion
//       for (const [status, count] of statusResults) {
//         if (status === ControlStatus.Enum.FULLY_IMPLEMENTED) {
//           finalStatus = ControlStatus.Enum.FULLY_IMPLEMENTED;
//           break;
//         } else if (status === ControlStatus.Enum.PARTIALLY_IMPLEMENTED) {
//           finalStatus = ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
//         }
//       }

//       return finalStatus;
//     } else {
//       return "No data found";
//     }
//   } catch (error) {
//     console.error("Error executing the query:", error);
//     throw error;
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
      const { accountEnabled = false, signInActivity } =
        userDetails.value || {};
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

async function getHumanResourceSecurityEvidence({ azureAd }: AzureAUth) {
  console.log("getOrganizationInformationSecurityEvidence...");
  if (!azureAd) throw new Error("Azure AD token is required");
  const azureClient = await initializeAzureClient(azureAd.token);
  return evaluate([() => getAccessManagementLogs(azureClient)]);
}

export { getHumanResourceSecurityEvidence };
