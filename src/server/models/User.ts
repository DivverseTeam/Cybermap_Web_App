import mongoose from "mongoose";

import { USER_ROLES, type UserRole } from "~/lib/types";

export interface User extends mongoose.Document {
	name: string;
	role: UserRole;
	email: string;
	password: string;
	organizationId?: string;
}

const UserSchema = new mongoose.Schema<User>(
	{
		name: {
			type: String,
			required: [true, "Please provide a name for this User."],
			maxlength: [60, "Name cannot be more than 60 characters"],
		},
		email: {
			type: String,
			required: [true, "Please provide an email this User"],
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Please provide a password for this User"],
		},
		organizationId: {
			type: String,
			required: false,
		},
		role: {
			type: String,
			role: USER_ROLES,
			default: "AUDITOR",
		},
	},
	{
		toObject: {
			transform: (_doc, ret, _options) => {
				delete ret.password;
				return ret;
			},
		},
		toJSON: {
			transform: function (_doc, ret, _options) {
				delete ret.password;
				return ret;
			},
		},
	},
);

export default (mongoose.models.User as mongoose.Model<User>) ||
	mongoose.model("User", UserSchema);
