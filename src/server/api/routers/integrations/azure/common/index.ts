import type { Group, User, AppRoleAssignment } from "@microsoft/microsoft-graph-types";
import { azureClient } from "../init";

const listUsers = async (): Promise<{ value: User[] }> => {
  const response = await azureClient.api("/users").get();
  return response;
};

const getUserDetails = async (UserId: string): Promise<{ value: User }> => {
  const userDetails = await azureClient.api(`/users/${UserId}`).get();
  return userDetails;
};

const getUserRoleAssignments = async (
  UserId: string
): Promise<{ value: AppRoleAssignment[] }> => {
  return await azureClient.api(`/users/${UserId}/appRoleAssignments`).get();
};

const listGroups = async (): Promise<{ value: Group[] }> => {
  const response = await azureClient.api("/groups").get();
  return response;
};

const listUserGroups = async (userId: string): Promise<{ value: Group[] }> => {
  const userGroups = await azureClient.api(`/users/${userId}/memberOf`).get();
  return userGroups;
};

export {
  getUserDetails,
  listGroups,
  listUserGroups,
  listUsers,
  getUserRoleAssignments,
};
