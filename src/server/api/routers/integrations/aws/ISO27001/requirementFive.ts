import {
  IAMClient,
  GetUserCommand,
  ListAccessKeysCommand,
  ListRolesCommand,
  ListMFADevicesCommand,
} from "@aws-sdk/client-iam";
import { iamClient } from "../init";


// Access control logs: Retrieves user information
// Evidence: Get user access details to enforce least privilege access
const getUserAccessDetails = async (username: string) => {
  try {
    const data = await iamClient.send(
      new GetUserCommand({ UserName: username })
    );
    console.log("User Access Details:", data);
    return data;
  } catch (error) {
    console.error("Error getting user access details:", error);
  }
};

// Access control logs: Lists access keys for a user
// Evidence: Access details to enforce least privilege
const listUserAccessKeys = async (username: string) => {
  try {
    const data = await iamClient.send(
      new ListAccessKeysCommand({ UserName: username })
    );
    console.log("Access Keys:", data.AccessKeyMetadata);
    return data.AccessKeyMetadata;
  } catch (error) {
    console.error("Error listing access keys:", error);
  }
};

// Access control logs: Lists all roles
// Evidence: Enforce role-based access, ensuring least privilege for resources
const listRoles = async () => {
  try {
    const data = await iamClient.send(new ListRolesCommand({}));
    console.log("Roles:", data.Roles);
    return data.Roles;
  } catch (error) {
    console.error("Error listing roles:", error);
  }
};

// MFA enforcement logs: Lists MFA devices for a user
// Evidence: Verify MFA enforcement for critical system access
const listMFADevicesForUser = async (username: string) => {
  try {
    const data = await iamClient.send(
      new ListMFADevicesCommand({ UserName: username })
    );
    console.log("MFA Devices:", data.MFADevices);
    return data.MFADevices;
  } catch (error) {
    console.error("Error listing MFA devices:", error);
  }
};
