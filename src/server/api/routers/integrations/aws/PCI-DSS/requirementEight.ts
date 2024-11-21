// Requirement 8: Identify and authenticate access to system components

import { LookupEventsCommand } from "@aws-sdk/client-cloudtrail";
import {
  GetAccountPasswordPolicyCommand,
  ListAccessKeysCommand,
  ListMFADevicesCommand,
  ListUsersCommand,
} from "@aws-sdk/client-iam";
import { cloudTrailClient, iamClient } from "../init";

// 1. Retrieve User Authentication Logs using AWS CloudTrail
async function getUserAuthenticationLogs(startTime: Date, endTime: Date) {
  try {
    const command = new LookupEventsCommand({
      StartTime: startTime,
      EndTime: endTime,
      LookupAttributes: [
        {
          AttributeKey: "EventName",
          AttributeValue: "ConsoleLogin", // Track login attempts; add other values as needed.
        },
      ],
    });
    const data = await cloudTrailClient.send(command);
    return data.Events;
  } catch (error) {
    console.error("Error retrieving user authentication logs:", error);
    throw error;
  }
}

// 2. Retrieve MFA Enforcement Status and Unique User IDs
async function getUserAccessInfo() {
  try {
    const command = new ListUsersCommand({});
    const users = await iamClient.send(command);
    if (!users.Users) {
      return [];
    }
    const accessInfo = await Promise.all(
      users.Users.map(async (user) => {
        const command2 = new ListMFADevicesCommand({ UserName: user.UserName });
        const mfaDevices = await iamClient.send(command2);
        return {
          userId: user.UserId,
          userName: user.UserName,
          mfaEnabled:
            mfaDevices?.MFADevices && mfaDevices?.MFADevices.length > 0,
        };
      })
    );
    return accessInfo;
  } catch (error) {
    console.error("Error retrieving user access information:", error);
    throw error;
  }
}

// 3. Retrieve Password Policy to Check for Strong Password Enforcement
async function getPasswordPolicy() {
  try {
    const command = new GetAccountPasswordPolicyCommand({});
    const policy = await iamClient.send(command);
    return policy.PasswordPolicy;
  } catch (error) {
    console.error("Error retrieving password policy:", error);
    throw error;
  }
}

// 4. List Access Keys for Users
async function listAccessKeys(userName: string) {
  try {
    const command = new ListAccessKeysCommand({ UserName: userName });
    const accessKeys = await iamClient.send(command);
    return accessKeys.AccessKeyMetadata;
  } catch (error) {
    console.error(`Error retrieving access keys for user ${userName}:`, error);
    throw error;
  }
}

export async function getEvidence() {
  const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
  const endTime = new Date();

  const userAuthenticationLogs = await getUserAuthenticationLogs(
    startTime,
    endTime
  );
  const userAccessInfo = await getUserAccessInfo();
  const passwordPolicy = await getPasswordPolicy();
  const accessKeys = await listAccessKeys("your-user-name");

  return { userAuthenticationLogs, userAccessInfo, passwordPolicy, accessKeys };
 }
