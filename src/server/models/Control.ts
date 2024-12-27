import mongoose from "mongoose";
import { z } from "zod";
import { FRAMEWORK_NAMES, FrameworkName } from "~/lib/types";
import { ControlStatus } from "~/lib/types/controls";
import { BaseSchema } from "./base";

export const OrganisationControl = z.object({
  _id: z.string(),
  name: z.string(),
  code: z.string(),
  organisationId: z.string().optional(),
  integrationIds: z.array(z.string()).optional(),
  status: ControlStatus,
  mapped: FrameworkName.array(),
});

export type OrganisationControl = z.infer<typeof OrganisationControl>;

export const ControlType = z.object({
  _id: z.string(),
  name: z.string(),
  code: z.string(),
  mapped: FrameworkName.array(),
});

export type ControlType = z.infer<typeof ControlType>;

type ControlWithDocument = ControlType & mongoose.Document;

const ControlSchema = new BaseSchema<ControlWithDocument>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    mapped: { type: [String], required: true, enum: FRAMEWORK_NAMES },
  },
);

export default (mongoose.models
  .CybermapControl as mongoose.Model<ControlWithDocument>) ||
  mongoose.model("CybermapControl", ControlSchema);
