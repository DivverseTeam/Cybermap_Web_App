import {
  ListAttachedRolePoliciesCommand,
  ListAttachedUserPoliciesCommand,
  ListMFADevicesCommand,
  ListRolePoliciesCommand,
  ListRolesCommand,
  ListUserPoliciesCommand,
  ListUsersCommand,
} from "@aws-sdk/client-iam";
import { iamClient } from "./init";

// IAM configurations and policies

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

async function listRoleInlinePolicies(roleName: string) {
  const listRolePoliciesCommand = new ListRolePoliciesCommand({
    RoleName: roleName,
  });
  const inlinePolicies = await iamClient.send(listRolePoliciesCommand);
  console.log(
    `Inline Policies for Role ${roleName}:`,
    inlinePolicies.PolicyNames
  );
}

async function fetchAndStoreIAMConfigurations() {
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

// MFA enforcement

async function checkMFAForCriticalAccounts() {
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
