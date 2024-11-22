import {
  ListRolesCommand,
  ListUsersCommand,
  GetUserPolicyCommand,
} from "@aws-sdk/client-iam";
import {
  LookupAttributeKey,
  LookupEventsCommand,
} from "@aws-sdk/client-cloudtrail";
import { cloudTrailClient, iamClient } from "../init";

/**
 * Evidence: Role-based access control (RBAC)
 * Lists IAM roles to demonstrate role-based access control and assigned responsibilities.
 */
const listRoles = async () => {
  try {
    const command = new ListRolesCommand({});
    const response = await iamClient.send(command);
    return response.Roles;
  } catch (error) {
    console.error("Error listing roles:", error);
  }
};

/**
 * Evidence: Role-based access control (RBAC)
 * Lists IAM users to show who has access to the AWS environment.
 */
const listUsers = async () => {
  try {
    const command = new ListUsersCommand({});
    const response = await iamClient.send(command);
    return response.Users;
  } catch (error) {
    console.error("Error listing users:", error);
  }
};

/**
 * Evidence: Role-based access control (RBAC)
 * Retrieves user policies to confirm roles, permissions, and prevent excessive privileges.
 */
const getUserPolicies = async () => {
  try {
    // Fetch all user names
    const userNames = await listUsers().then((users) => {
      if (!users) return [];
      return users.map((user) => user.UserName);
    });

    if (userNames.length === 0) {
      console.log("No users found.");
      return;
    }

    // Fetch policies for each user
    const policies = await Promise.all(
      userNames.map(async (userName) => {
        try {
          const command = new GetUserPolicyCommand({
            UserName: userName,
            PolicyName: "UserPolicy",
          });
          const response = await iamClient.send(command);
          return { userName, policy: response.PolicyDocument };
        } catch (error) {
          console.error(`Error getting policy for user ${userName}:`, error);
          return { userName, policy: null }; // Return null for users with errors
        }
      })
    );

    return policies; // Returns an array of { userName, policy }
  } catch (error) {
    console.error("Error listing users or fetching policies:", error);
  }
};


/**
 * Evidence: Third-party agreements (CloudTrail Tracking)
 * Looks up events in CloudTrail to track actions by third-party providers, ensuring they meet security obligations.
 */
const lookupEvents = async (
  lookupAttribute: LookupAttributeKey,
  lookupValue: string
) => {
  try {
    const command = new LookupEventsCommand({
      LookupAttributes: [
        { AttributeKey: lookupAttribute, AttributeValue: lookupValue },
      ],
    });
    const response = await cloudTrailClient.send(command);
    return response.Events;
  } catch (error) {
    console.error("Error looking up events:", error);
  }
};
