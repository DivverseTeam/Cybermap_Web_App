import mongoose from "mongoose";
import { z } from "zod";

import { BaseSchema } from "./base";

export const EmployeeType = z.object({
  _id: z.string(), // Include _id as a string for the client
  firstName: z.string(),
  lastName: z.string(),
  employeeId: z.string(),
  email: z.string(),
  jobTitle: z.string(),
  gender: z.string(),
  hireDate: z.coerce.date().or(z.string()),
  terminationDate: z.coerce.date().optional().or(z.string()),
  lastSeen: z.coerce.date().optional(),
  lastPasswordUpdate: z.coerce.date().optional(),
  organisationId: z.string().optional(),
  complianceList: z.array(z.record(z.boolean().optional())).optional(), // Using z.record for the complianceList
});

export type EmployeeType = z.infer<typeof EmployeeType>;

type EmployeeWithDocument = EmployeeType & mongoose.Document;

const EmployeeSchema = new BaseSchema<EmployeeWithDocument>({
  employeeId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  hireDate: {
    type: Date,
    required: true,
  },
  terminationDate: {
    type: Date,
    required: false,
  },
  lastSeen: {
    type: Date,
    required: false,
  },
  lastPasswordUpdate: {
    type: Date,
    required: false,
  },
  organisationId: { type: String, required: true },
  complianceList: {
    type: [Object],
    required: false,
  },
});

export default (mongoose.models
  .Employee as mongoose.Model<EmployeeWithDocument>) ||
  mongoose.model("Employee", EmployeeSchema);
