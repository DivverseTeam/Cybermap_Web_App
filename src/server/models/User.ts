import mongoose from "mongoose";
import { z } from "zod";

import { USER_ROLES, UserRole } from "~/lib/types";
import { BaseSchema } from "./base";

export const User = z.object({
  id: z.string(),
  name: z.string(),
  role: UserRole,
  cognitoId: z.string(),
  email: z.string(),
  organisationId: z.string().optional(),
});

export type User = z.infer<typeof User>;

type UserWithDocument = User & mongoose.Document;

const UserSchema = new BaseSchema<UserWithDocument>({
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
  cognitoId: {
    type: String,
    required: [true, "Please provide a cognito sub for this User"],
    unique: true,
  },
  organisationId: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    role: USER_ROLES,
    default: "AUDITOR",
  },
});

export default (mongoose.models.User as mongoose.Model<UserWithDocument>) ||
  mongoose.model("User", UserSchema);
