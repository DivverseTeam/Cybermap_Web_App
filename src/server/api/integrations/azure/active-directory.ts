import type {
	User,
	Group,
	DirectoryRole,
	AuthenticationMethod,
	DirectoryAudit,
	SignIn,
} from "@microsoft/microsoft-graph-types";
import { Client, type ClientOptions } from "@microsoft/microsoft-graph-client";

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

export const listDirectoryAudits = async (): Promise<DirectoryAudit[]> => {
	const logs: DirectoryAudit[] = await client
		.api("/auditLogs/directoryAudits")
		.get();
	return logs;
};

export const listSignIns = async (): Promise<SignIn[]> => {
	const signIns: SignIn[] = await client.api("/auditLogs/signIns").get();
	return signIns;
};

// Role management
// export const
