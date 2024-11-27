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
const getUserPolicy = async (userName: string) => {
  try {
    const command = new GetUserPolicyCommand({
      UserName: userName,
      PolicyName: "UserPolicy",
    });
    const response = await iamClient.send(command);
    return response.PolicyDocument;
  } catch (error) {
    console.error(`Error getting policy for user ${userName}:`, error);
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
