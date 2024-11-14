import { oktaClient, TIME_FRAME } from "../init";

// Function to get all users, their roles, and permissions
async function getUsersRolesAndPermissions() {
  try {
    const users = [];
    await oktaClient.listUsers().each((user) => users.push(user));

    const userRolesPermissions = await Promise.all(
      users.map(async (user) => {
        try {
          const roles = [];
          await oktaClient
            .listUserRoles(user.id)
            .each((role) => roles.push(role));
          return {
            userId: user.id,
            userName: user.profile.login,
            roles,
            permissions: roles.flatMap((role) => role.permissions || []), // Add permissions if roles include them
          };
        } catch (error) {
          console.error(`Error fetching roles for user ${user.id}:`, error);
          return { userId: user.id, error: error.message };
        }
      })
    );
    return userRolesPermissions;
  } catch (error) {
    console.error("Error fetching user roles and permissions:", error);
    throw error;
  }
}

// Function to verify MFA is enabled for critical accounts
async function verifyMFAForCriticalAccounts() {
  try {
    const criticalUsers = [];
    await oktaClient
      .listUsers({ filter: 'status eq "ACTIVE"' })
      .each(async (user) => {
        const factors = await oktaClient.listFactors(user.id);
        const hasMFA = await factors.some(
          (factor) =>
            factor.factorType === "token:software:totp" ||
            factor.factorType === "push"
        );
        criticalUsers.push({
          userId: user.id,
          userName: user.profile.login,
          hasMFA,
        });
      });
    return criticalUsers.filter((user) => !user.hasMFA);
  } catch (error) {
    console.error("Error verifying MFA for critical accounts:", error);
    throw error;
  }
}

// Function to get specific logs for monitoring user activity and changes
async function getSecurityLogs(timeFrame: string) {
  try {
    const logs = await oktaClient.getLogs({
      since: timeFrame,
      filter:
        'eventType eq "user.session.start" or eventType eq "user.account.update" or ' +
        'eventType eq "system.login.attempt" or ' +
        'eventType eq "system.login.failure"',
    });
    const relevantLogs = [];
    await logs.each((log) => relevantLogs.push(log));
    return relevantLogs;
  } catch (error) {
    console.error("Error fetching security logs:", error);
    throw error;
  }
}

async function getAccessControlEvidence() {
  try {
    const rolePermissionReport = await getUsersRolesAndPermissions();
    console.log("Users Roles Permissions Report:", rolePermissionReport);

    const mfaReport = await verifyMFAForCriticalAccounts();
    console.log("Critical Accounts without MFA", mfaReport);

    const activityLogs = await getSecurityLogs(TIME_FRAME);
    console.log("Monitoring And Logging Evidence:", activityLogs);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

export { getAccessControlEvidence };
