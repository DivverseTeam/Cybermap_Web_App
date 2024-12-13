import { Client } from "@microsoft/microsoft-graph-client";
import type {
  AppRoleAssignment,
  Group,
  User,
} from "@microsoft/microsoft-graph-types";
import { subscriptionClient } from "../init";

const listUsers = async (azureClient: Client): Promise<{ value: User[] }> => {
  const response = await azureClient.api("/users").get();
  return response;
};

const getUserDetails = async (
  UserId: string,
  azureClient: Client
): Promise<{ value: User }> => {
  const userDetails = await azureClient.api(`/users/${UserId}`).get();
  return userDetails;
};

const getUserRoleAssignments = async (
  UserId: string,
  azureClient: Client
): Promise<{ value: AppRoleAssignment[] }> => {
  return await azureClient.api(`/users/${UserId}/appRoleAssignments`).get();
};

const listGroups = async (azureClient: Client): Promise<{ value: Group[] }> => {
  const response = await azureClient.api("/groups").get();
  return response;
};

const listUserGroups = async (
  userId: string,
  azureClient: Client
): Promise<{ value: Group[] }> => {
  const userGroups = await azureClient.api(`/users/${userId}/memberOf`).get();
  return userGroups;
};

async function listSubscriptions() {
  try {
    // const subscriptions = await subscriptionClient.subscriptions.list();
    // const subscriptionIds = subscriptions.map((sub) => sub.subscriptionId);
    return await [];
  } catch (error) {
    console.error("Error retrieving subscriptions:", error);
  }
}

export {
  getUserDetails,
  getUserRoleAssignments,
  listGroups,
  listSubscriptions,
  listUserGroups,
  listUsers,
};
