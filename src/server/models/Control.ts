import mongoose from "mongoose";
import { z } from "zod";
import { BaseSchema } from "./base";
import { ControlStatus } from "~/lib/types/controls";
import { FRAMEWORK_NAMES, FrameworkName } from "~/lib/types";
import { CONTROL_STATUSES } from "~/lib/constants/controls";

export const OrganisationControl = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  mapped: FrameworkName.array(),
  organisationId: z.string(),
});

export type OrganisationControl = z.infer<typeof OrganisationControl>;

type ControlWithDocument = OrganisationControl & mongoose.Document;

const ControlSchema = new BaseSchema<ControlWithDocument>({
  name: { type: String, required: true },
  code: { type: String, required: true },
  mapped: { type: [String], required: true, enum: FRAMEWORK_NAMES },
});

export default (mongoose.models
  .CybermapControl as mongoose.Model<ControlWithDocument>) ||
  mongoose.model("CybermapControl", ControlSchema);
