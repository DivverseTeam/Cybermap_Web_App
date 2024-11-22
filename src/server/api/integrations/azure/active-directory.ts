import { Client, type Options } from "@microsoft/microsoft-graph-client";
import type {
  AppRoleAssignment,
  AuthenticationMethod,
  DirectoryAudit,
  DirectoryRole,
  Group,
  RoleAssignment,
  SignIn,
  User,
} from "@microsoft/microsoft-graph-types";
import { format, formatDate } from "date-fns";

const accessToken =
  "eyJ0eXAiOiJKV1QiLCJub25jZSI6ImF1dWxEUUc5eEZlSnR2VlFFa0Zrc21qOFdydW5OT2x5VnduNjc3enJhQk0iLCJhbGciOiJSUzI1NiIsIng1dCI6Inp4ZWcyV09OcFRrd041R21lWWN1VGR0QzZKMCIsImtpZCI6Inp4ZWcyV09OcFRrd041R21lWWN1VGR0QzZKMCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC80NjFhMGM1NC03NWM2LTQ1ODYtOGI1Ny1mZjYyNzVmNDc2NDQvIiwiaWF0IjoxNzMyMTk1MzQ5LCJuYmYiOjE3MzIxOTUzNDksImV4cCI6MTczMjIwMDk0MywiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFZUUFlLzhZQUFBQUgwc2xzazBWSlVJay9Wd2xocjZ2cHJxU3ptOGg2NlZ3UnhZNUdiU2xJOHUyNlNhNEp0Mk4xQXVkV3pTblV4cnR3MFFhR3kvZDdacW9uWFNaZnVZMC93U1VpUzdGblhwWUFCZTZFa0JmbWVEYjc3V1d2Q2dpRzl6UXFORFlpTlVhMWFBQ3dxbldpbHYyOGtWa3c4L1g3MkV0SVk5Vmx0RC9xT1d6MUgwLzZUVT0iLCJhbHRzZWNpZCI6IjE6bGl2ZS5jb206MDAwNjQwMDBDQzJCRjc5OSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiQ3liZXJtYXAgRGV2IiwiYXBwaWQiOiIzMzdjMzFlNy0yMjNkLTRmOTEtYjY0MC1lMDdiYTQzM2UxZjAiLCJhcHBpZGFjciI6IjEiLCJlbWFpbCI6Imphbm9ueW1vdXNvbmVAaG90bWFpbC5jby51ayIsImZhbWlseV9uYW1lIjoiQWZvbGFiaSIsImdpdmVuX25hbWUiOiJKb2huIiwiaWRwIjoibGl2ZS5jb20iLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiIxMDIuODguNzAuNDQiLCJuYW1lIjoiSm9obiBBZm9sYWJpIiwib2lkIjoiMmFjZmY1NmQtNjAwMS00NDMyLTk2YTAtYTk0ODJjZjQ2N2UzIiwicGxhdGYiOiI1IiwicHVpZCI6IjEwMDMyMDAzRjNGQ0M0RjQiLCJyaCI6IjEuQVJNQlZBd2FSc1oxaGtXTFZfOWlkZlIyUkFNQUFBQUFBQUFBd0FBQUFBQUFBQUFVQVdZVEFRLiIsInNjcCI6IkF1ZGl0TG9nLlJlYWQuQWxsIERpcmVjdG9yeS5SZWFkLkFsbCBVc2VyLlJlYWQgVXNlci5SZWFkLkFsbCBVc2VyQXV0aGVudGljYXRpb25NZXRob2QuUmVhZC5BbGwgcHJvZmlsZSBvcGVuaWQgZW1haWwiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJ6NDJtLWUtU2Rwd1lGbnVWbW1uZnRnWWxVRy0tRllhbVJaYUFMOTc5NEVVIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IkFGIiwidGlkIjoiNDYxYTBjNTQtNzVjNi00NTg2LThiNTctZmY2Mjc1ZjQ3NjQ0IiwidW5pcXVlX25hbWUiOiJsaXZlLmNvbSNqYW5vbnltb3Vzb25lQGhvdG1haWwuY28udWsiLCJ1dGkiOiJCUWpRbERra2RFcXc2RkVmekk0YkFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyI2MmU5MDM5NC02OWY1LTQyMzctOTE5MC0wMTIxNzcxNDVlMTAiLCJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2lkcmVsIjoiMSA0IiwieG1zX3N0Ijp7InN1YiI6IkZMQ2JKS1Q5NDhNcEpRRHNVM2JaUnp4RDZ1blVyOGZLQkoyLXJzTkhQQTgifSwieG1zX3RjZHQiOjE3MzA4OTcwNjF9.jQ2KHTH3xWmBCFEn7ixFz4TKA3wQwTBWUhXMdsTHMUwwmyf_HYIC5L5Fc0vr3MjrXfO_-rYCIOScuCWKdC02MxAyReqO4wH1AGw7q1ht-RyHTt9Asmju_btjHBCC-uembVzMbcVVeaYZ8pt9U5WekJ78aV17kOElAv2wOeZ7qUDr2_sqtBqOYr3DcnXXSLC8d8CZRmPbKq6DP4VpFeblqJN0qiD52nrEsC0LrHZf2qjQoPxvTL3SfVl9xH4D-HhLHU-0LSWcJOWefJZJSpO1rWyAkhnw9jzAlOSZxTuuaxwyDVx4ECrsh-h5_Ra9tOlM_XX4lQ9K6fotQDxLlJ_4MA";

const options: Options = {
  authProvider: (done) => {
    done(null, accessToken);
  },
};

const client = Client.init(options);

export const listUsers = async (): Promise<User[]> => {
  const users: User[] = await client.api("/users").get();
  return users;
};

export const listGroups = async (): Promise<Group[]> => {
  const groups: Group[] = await client.api("/groups").get();
  return groups;
};

export const listDirectoryRoles = async (): Promise<DirectoryRole[]> => {
  const directoryRoles: DirectoryRole[] = await client
    .api("/directoryRoles")
    .get();
  return directoryRoles;
};

export const listUserAuthenticationMethods = async (
  userId: string,
): Promise<AuthenticationMethod[]> => {
  const methods: AuthenticationMethod[] = await client
    .api(`/users/${userId}/authentication/methods`)
    .get();
  return methods;
};

export const listDirectoryAudits = async (
  since: Date,
): Promise<DirectoryAudit[]> => {
  const startDateString = since.toISOString();
  const logs: DirectoryAudit[] = await client
    .api("/auditLogs/directoryAudits")
    .filter(`createdDateTime ge ${startDateString}`)
    .get();
  return logs;
};

export const listSignIns = async (since: Date): Promise<SignIn[]> => {
  const startDateString = since.toISOString();
  const signIns: SignIn[] = await client
    .api("/auditLogs/signIns")
    .filter(`createdDateTime ge ${startDateString}`)
    .get();
  return signIns;
};

export const listRoleAssignments = async (): Promise<RoleAssignment[]> => {
  const assignments: RoleAssignment[] = await client
    .api(`/roleManagement/directory/roleAssignments`)
    .expand("principal")
    .get();
  return assignments;
};

export const listUserAppRoleAssignments = async (userId: string) => {
  const assignments: AppRoleAssignment[] = await client
    .api(`/users/${userId}/appRoleAssignments`)
    .get();
  return assignments;
};

export const getPasswordChangeLogs = async () => {
  const logs: DirectoryAudit[] = await client
    .api("/auditLogs/directoryAudits")
    .filter("activityDisplayName eq 'Change user password'")
    .get();

  logs.forEach((log) => {
    console.log({
      id: log.id,
      activityDateTime: log.activityDateTime,
      activityDisplayName: log.activityDisplayName,
      initiatedBy: log.initiatedBy?.user?.displayName || "Unknown",
    });
  });

  return logs;
};

const users = await listUserAuthenticationMethods(
  "2acff56d-6001-4432-96a0-a9482cf467e3",
);

console.log(users);
