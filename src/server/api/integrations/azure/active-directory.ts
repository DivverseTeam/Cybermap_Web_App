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
  "eyJ0eXAiOiJKV1QiLCJub25jZSI6IlhWd1QyRnpKRU1UNmdVRXBVaDJXWVU3blRvbGlJTmk4WE40bk9TWlRpbjQiLCJhbGciOiJSUzI1NiIsIng1dCI6Inp4ZWcyV09OcFRrd041R21lWWN1VGR0QzZKMCIsImtpZCI6Inp4ZWcyV09OcFRrd041R21lWWN1VGR0QzZKMCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC80NjFhMGM1NC03NWM2LTQ1ODYtOGI1Ny1mZjYyNzVmNDc2NDQvIiwiaWF0IjoxNzMyMDE0OTU4LCJuYmYiOjE3MzIwMTQ5NTgsImV4cCI6MTczMjAyMDQ5NSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFXUUFtLzhZQUFBQXhrUW5WZytUdmFvZjYrdFJJNE4yQi84NW5abE1hVmF5aTB4TnNYdS9Kc2NTbTNkVmRKT2ROOGYxUThVeUkrMnF6bXQxdDluOUxDeTluc0thd2ZZdXkxSkc4YWJ4NEIzbXBUUUozNTU2NG1NY1lxTVlrU3o4eVhjQjIvU1lHeEdpIiwiYWx0c2VjaWQiOiIxOmxpdmUuY29tOjAwMDY0MDAwQ0MyQkY3OTkiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkN5YmVybWFwIERldiIsImFwcGlkIjoiMzM3YzMxZTctMjIzZC00ZjkxLWI2NDAtZTA3YmE0MzNlMWYwIiwiYXBwaWRhY3IiOiIxIiwiZW1haWwiOiJqYW5vbnltb3Vzb25lQGhvdG1haWwuY28udWsiLCJmYW1pbHlfbmFtZSI6IkFmb2xhYmkiLCJnaXZlbl9uYW1lIjoiSm9obiIsImlkcCI6ImxpdmUuY29tIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMzUuMjQxLjE3OS42MyIsIm5hbWUiOiJKb2huIEFmb2xhYmkiLCJvaWQiOiIyYWNmZjU2ZC02MDAxLTQ0MzItOTZhMC1hOTQ4MmNmNDY3ZTMiLCJwbGF0ZiI6IjUiLCJwdWlkIjoiMTAwMzIwMDNGM0ZDQzRGNCIsInJoIjoiMS5BUk1CVkF3YVJzWjFoa1dMVl85aWRmUjJSQU1BQUFBQUFBQUF3QUFBQUFBQUFBQVVBV1lUQVEuIiwic2NwIjoiQXVkaXRMb2cuUmVhZC5BbGwgRGlyZWN0b3J5LlJlYWQuQWxsIFVzZXIuUmVhZCBwcm9maWxlIG9wZW5pZCBlbWFpbCIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6Ino0Mm0tZS1TZHB3WUZudVZtbW5mdGdZbFVHLS1GWWFtUlphQUw5Nzk0RVUiLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiQUYiLCJ0aWQiOiI0NjFhMGM1NC03NWM2LTQ1ODYtOGI1Ny1mZjYyNzVmNDc2NDQiLCJ1bmlxdWVfbmFtZSI6ImxpdmUuY29tI2phbm9ueW1vdXNvbmVAaG90bWFpbC5jby51ayIsInV0aSI6IlFLLVhSc0tJX0VxMnRrSWRXZ2N3QUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfaWRyZWwiOiIxIDI0IiwieG1zX3N0Ijp7InN1YiI6IkZMQ2JKS1Q5NDhNcEpRRHNVM2JaUnp4RDZ1blVyOGZLQkoyLXJzTkhQQTgifSwieG1zX3RjZHQiOjE3MzA4OTcwNjF9.FYMxuzRKga7RvVA2GcfZhmNKS71H8qcHRVHlsGBREoCALRADSErbGsAqoIwCI054ws320O7PpWQODCWKT5gJX51M2NOuFi0Lm5ZHHgH3dg6PPhId5ROD-xsgOWqulMZwXo_jpBdzq5rYYLVwWm8g6dHCaqcmRStX38yUdCQRU7U61S2nd7HabDaJcjD39Xn_jXIZBV8M1PC8nuSs6E0fR5MF3kp3wiM6UsYNjmdZzQX8PjJ2XTuHNo5ndTI3HjFdjrXKxR-O9xI8GYotqf2mqg8MC_c2xDy5IQ-CrJCwfYodO3RAo1pWY4Rl1nJdChRJrcvW7iUFDH8G252joqm1-Q";

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
