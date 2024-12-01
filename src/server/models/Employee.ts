import mongoose from "mongoose";
import { z } from "zod";

import { BaseSchema } from "./base";

export const Employee = z.object({
  id: z.string(),
  employeeId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  gender: z.string(),
  hireDate: z.coerce.date(),
  terminationDate: z.coerce.date().optional(),
  organisationId: z.string(),
  createdAt: z.coerce.date(),
  errorCode: z.string().optional(),
});

export type Employee = z.infer<typeof Employee>;

type EmployeeWithDocument = Employee & mongoose.Document;

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
});

export default (mongoose.models
  .Employee as mongoose.Model<EmployeeWithDocument>) ||
  mongoose.model("Employee", EmployeeSchema);
