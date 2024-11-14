// Logical Access Controls (Security)

import { LookupEventsCommand } from "@aws-sdk/client-cloudtrail";
import {
  ListAttachedRolePoliciesCommand,
  ListAttachedUserPoliciesCommand,
  ListMFADevicesCommand,
  ListRolesCommand,
  ListUserPoliciesCommand,
  ListUsersCommand,
} from "@aws-sdk/client-iam";
import { getCloudTrailEvents } from "../common";
import { cloudTrailClient, iamClient } from "../init";

// IAM configurations and policies:
async function listIAMUsers() {
  try {
    const listUsersCommand = new ListUsersCommand();
    const response = await iamClient.send(listUsersCommand);
    if (!response.Users) return [];
    for (const user of response.Users) {
      const listAttachedUserPoliciesCommand =
        new ListAttachedUserPoliciesCommand({
          UserName: user.UserName,
        });
      const policies = await iamClient.send(listAttachedUserPoliciesCommand);
      console.log(
        `User: ${user.UserName}`,
        "Policies:",
        policies.AttachedPolicies
      );
    }
  } catch (error) {
    console.error("Error fetching IAM users or policies:", error);
  }
}

// IAM configurations and policies:
async function listIAMRoles() {
  try {
    const listRolesCommand = new ListRolesCommand();
    const response = await iamClient.send(listRolesCommand);
    if (!response.Roles) return [];

    for (const role of response.Roles) {
      const listAttachedRolePoliciesCommand =
        new ListAttachedRolePoliciesCommand({
          RoleName: role.RoleName,
        });
      const policies = await iamClient.send(listAttachedRolePoliciesCommand);
      console.log(
        `Role: ${role.RoleName}`,
        "Policies:",
        policies.AttachedPolicies
      );
    }
  } catch (error) {
    console.error("Error fetching IAM roles or policies:", error);
  }
}

// IAM configurations and policies:
async function listUserInlinePolicies(userName: string) {
  const listUserPoliciesCommand = new ListUserPoliciesCommand({
    UserName: userName,
  });
  const inlinePolicies = await iamClient.send(listUserPoliciesCommand);
  console.log(
    `Inline Policies for User ${userName}:`,
    inlinePolicies.PolicyNames
  );
}

// IAM configurations and policies: A record of which users have access to specific resources, their roles, and the permissions assigned to them
async function getIAMConfigurations() {
  const iamData = { users: [], roles: [] };
  const listUsersCommand = new ListUsersCommand();
  const response = await iamClient.send(listUsersCommand);
  if (!response.Users) return;
  for (const user of response.Users) {
    const listAttachedUserPoliciesCommand = new ListAttachedUserPoliciesCommand(
      {
        UserName: user.UserName,
      }
    );
    const policies = await iamClient.send(listAttachedUserPoliciesCommand);
    iamData.users.push({
      userName: user.UserName,
      policies: policies.AttachedPolicies,
    } as never);
  }

  const listRolesCommand = new ListRolesCommand();
  const rolesResponse = await iamClient.send(listRolesCommand);
  if (!rolesResponse.Roles) return;

  for (const role of rolesResponse.Roles) {
    const listAttachedRolePoliciesCommand = new ListAttachedRolePoliciesCommand(
      {
        RoleName: role.RoleName,
      }
    );
    const policies = await iamClient.send(listAttachedRolePoliciesCommand);
    iamData.roles.push({
      roleName: role.RoleName,
      policies: policies.AttachedPolicies,
    } as never);
  }
}

// MFA enforcement: Proof that multi-factor authentication is enabled for all critical accounts.
export async function checkMFAForCriticalAccounts() {
  try {
    const listUsersCommand = new ListUsersCommand();
    const response = await iamClient.send(listUsersCommand);
    if (!response.Users) return;

    const input = {
      UserName: response?.Users[0]?.UserName,
    };
    const listMFADevicesCommand = new ListMFADevicesCommand(input);

    for (const user of response.Users) {
      input.UserName = user.UserName;
      const mfaDevicesResponse = await iamClient.send(listMFADevicesCommand);
      if (!mfaDevicesResponse.MFADevices) return null;
      if (mfaDevicesResponse.MFADevices.length > 0) {
        console.log(`User: ${user.UserName} has MFA enabled.`);
      } else {
        console.log(`User: ${user.UserName} does NOT have MFA enabled!`);
      }
    }
  } catch (error) {
    console.error("Error checking MFA status:", error);
  }
}

// Login and activity logs:  failed login attempts
async function fetchLoginAttempts() {
  try {
    const response = await getCloudTrailEvents({
      lookupAttributes: [
        {
          AttributeKey: "EventName",
          AttributeValue: "ConsoleLogin",
        },
      ],
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      endTime: new Date(),
      maxResults: 50,
    });
    const events = response?.events;
    if (!events) return [];
    events.forEach((event: any) => {
      const loginStatus = event.responseElements.ConsoleLogin;
      console.log(`Login Attempt by ${event.username}: ${loginStatus}`, event);
    });
  } catch (error) {
    console.error("Error fetching login attempts:", error);
  }
}
//  Login and activity logs:  failed login attempts,
async function fetchUserLoginAttempts(username: string) {
  try {
    const response = await getCloudTrailEvents({
      lookupAttributes: [
        {
          AttributeKey: "EventName",
          AttributeValue: "ConsoleLogin",
        },
        {
          AttributeKey: "Username",
          AttributeValue: username,
        },
      ],
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      endTime: new Date(),
      maxResults: 50,
    });
    const events = response?.events;

    if (!events) return [];
    events.forEach((event: any) => {
      const loginStatus = event.responseElements.ConsoleLogin;
      console.log(`Login Attempt by ${event.username}: ${loginStatus}`, event);
    });
  } catch (error) {
    console.error("Error fetching login attempts for user:", error);
  }
}

// Login and activity logs: role changes and unauthorized access attempts
 async function getActivityLogs() {
  try {
    const command = new LookupEventsCommand({
      LookupAttributes: [
        { AttributeKey: "EventName", AttributeValue: "AssumeRole" }, // Role changes
        { AttributeKey: "EventName", AttributeValue: "UnauthorizedAccess" }, // Unauthorized access attempts (if custom)
      ],
      StartTime: new Date(new Date().setDate(new Date().getDate() - 7)), // Last 7 days
      EndTime: new Date(),
    });
    const response = await cloudTrailClient.send(command);
    return response.Events;
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return null;
  }
}

 async function getIAMConfigurationsAndPoliciesEvidence() {
  try {
    const [iamUsers, iamRoles] = await Promise.all([
      listIAMUsers(),
      listIAMRoles(),
    ]);

    return {
      iamUsers,
      iamRoles,
    };
  } catch (error) {
    console.error("Error fetching IAM configurations and policies:", error);
    return null;
  }
}

 async function getMFAEnforcementEvidence() {
  try {
    const mfaStatus = await checkMFAForCriticalAccounts(); // Check MFA status for all users
    return mfaStatus;
  } catch (error) {
    console.error("Error fetching MFA enforcement evidence:", error);
    return null;
  }
}

 async function getLoginAndActivityLogsEvidence() {
  try {
    const [loginAttempts, activityLogs] = await Promise.all([
      fetchLoginAttempts(),
      getActivityLogs(),
    ]);

    return {
      loginAttempts,
      activityLogs,
    };
  } catch (error) {
    console.error("Error fetching login and activity logs:", error);
    return null;
  }
}


export {
  getIAMConfigurationsAndPoliciesEvidence,
  getMFAEnforcementEvidence,
  getLoginAndActivityLogsEvidence,
}