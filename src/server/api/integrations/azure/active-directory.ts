import type {
	User,
	Group,
	DirectoryRole,
	AuthenticationMethod,
	DirectoryAudit,
	SignIn,
	RoleAssignment,
	AppRoleAssignment,
} from "@microsoft/microsoft-graph-types";
import { Client, type ClientOptions } from "@microsoft/microsoft-graph-client";
import { formatDate, format } from "date-fns";

const clientOptions: ClientOptions = {};
const client = Client.initWithMiddleware(clientOptions);

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
