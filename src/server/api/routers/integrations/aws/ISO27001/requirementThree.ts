// Import necessary AWS SDK clients
import { ListUsersCommand, DeleteUserCommand } from "@aws-sdk/client-iam";
import { LookupEventsCommand } from "@aws-sdk/client-cloudtrail";
import { cloudTrailClient, iamClient } from "../init";

/**
 * Evidence: User Access Logs
 * Function to retrieve the list of all IAM users. This can be used to verify that employees are onboarded and aware of their security responsibilities.
 */
const listAllUsers = async () => {
  try {
    const command = new ListUsersCommand({});
    const response = await iamClient.send(command);
    return response.Users;
  } catch (error) {
    console.error("Error listing IAM users:", error);
  }
};

/**
 * Evidence: Termination Records
 * Function to delete an IAM user. This can be used to remove access for employees or contractors upon termination.
 * @param {string} username - The username of the IAM user to be deleted
 */
const deleteUser = async (username: string) => {
  try {
    const command = new DeleteUserCommand({ UserName: username });
    const response = await iamClient.send(command);
    return response;
  } catch (error) {
    console.error(`Error deleting IAM user ${username}:`, error);
  }
};

/**
 * Evidence: Termination Records
 * Function to track and verify the activities of users using AWS CloudTrail, ensuring that terminated users no longer have access to AWS resources.
 * This can be used to ensure that user access is revoked after termination.
 */
const lookupUserEvents = async (username: string) => {
  try {
    const command = new LookupEventsCommand({
      LookupAttributes: [
        {
          AttributeKey: "Username",
          AttributeValue: username,
        },
      ],
    });
    const response = await cloudTrailClient.send(command);
    return response.Events;
  } catch (error) {
    console.error(`Error looking up events for user ${username}:`, error);
  }
};

/**
 * Evidence: User Access Logs
 * Function to track security training completion through CloudTrail logs.
 * This assumes specific CloudTrail events are logged when training is completed.
 * @param {string} username - The username of the IAM user to verify training completion
 */
const checkSecurityTrainingLogs = async (username: string) => {
  try {
    const command = new LookupEventsCommand({
      LookupAttributes: [
        {
          AttributeKey: "Username",
          AttributeValue: username,
        },
      ],
      StartTime: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), // Adjust time frame as needed
      EndTime: new Date(),
    });
    const response = await cloudTrailClient.send(command);
    return response.Events;
  } catch (error) {
    console.error(
      `Error checking security training logs for user ${username}:`,
      error
    );
  }
};
