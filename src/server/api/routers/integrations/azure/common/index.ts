import { ResourceManagementClient } from "@azure/arm-resources";
import { Client } from "@microsoft/microsoft-graph-client";
import type {
  AppRoleAssignment,
  Group,
  User,
} from "@microsoft/microsoft-graph-types";
import { StaticTokenCredential } from "../../common/azureTokenCredential";
import all from "it-all";

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

async function getAllLogAnalyticsWorkspaces({
  credential,
  subscriptionId,
}: {
  credential: StaticTokenCredential;
  subscriptionId: string;
}) {
  const client = new ResourceManagementClient(credential, subscriptionId);

  // List all resources and filter for Log Analytics workspaces
  const workspacesIterator = await client.resources.list();
  const workspaces = await asyncIteratorToArray(workspacesIterator);
  console.log("Workspaces", workspaces);

  for (const resource of workspaces) {
    if (resource.type === "Microsoft.OperationalInsights/workspaces") {
      workspaces.push({
        name: resource.name,
        id: resource.id,
        location: resource.location,
      });
    }
  }

  const workspacesIds: string[] = [];
  workspaces.map((workspace) => {
    if (workspace.id) {
      workspacesIds.push(workspace.id);
    }
  });

  return { workspacesIds };
}

function asyncIteratorToArray(iterator: AsyncIterable<any>) {
  return all(iterator);
}

export {
  getAllLogAnalyticsWorkspaces,
  getUserDetails,
  getUserRoleAssignments,
  listGroups,
  listSubscriptions,
  listUserGroups,
  listUsers,
  asyncIteratorToArray,
};
