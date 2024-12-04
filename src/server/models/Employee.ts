import mongoose from "mongoose";
import { z } from "zod";

import { BaseSchema } from "./base";

export const EmployeeType = z.object({
  employeeId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  gender: z.string(),
  hireDate: z.coerce.date(),
  terminationDate: z.coerce.date().optional(),
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
  organisationId: { type: String, required: true },
  complianceList: {
    type: [Object],
    required: false,
  },
});

export default (mongoose.models
  .Employee as mongoose.Model<EmployeeWithDocument>) ||
  mongoose.model("Employee", EmployeeSchema);
