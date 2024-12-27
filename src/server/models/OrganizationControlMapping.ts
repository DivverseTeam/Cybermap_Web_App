import mongoose, { Schema, Types } from "mongoose";
import { z } from "zod";

import { CONTROL_STATUSES } from "~/lib/constants/controls";
import { ControlStatus } from "~/lib/types/controls";
import { BaseSchema } from "./base";

export const OrgControlMapping = z.object({
  id: z.string(),
  controlId: z.string().refine((id) => Types.ObjectId.isValid(id), {
    message: "Invalid ObjectId for controlId",
  }),
  organisationId: z.string().refine((id) => Types.ObjectId.isValid(id), {
    message: "Invalid ObjectId for organisationId",
  }),
  integrationIds: z.array(z.string()),
  status: ControlStatus,
});

export type OrgControlMapping = z.infer<typeof OrgControlMapping>;

type OrgControlMappingWithDocument = OrgControlMapping & mongoose.Document;

const OrganizationControlMappingSchema =
  new BaseSchema<OrgControlMappingWithDocument>({
    // @ts-ignore
    controlId: {
      type: Schema.Types.ObjectId,
      ref: "Control",
      required: true,
    },
    // @ts-ignore
    organisationId: {
      type: Schema.Types.ObjectId,
      ref: "Organisation",
      required: true,
    },
    // @ts-ignore
    integrationIds: {
      // @ts-ignore
      type: [{ type: Schema.Types.ObjectId, ref: "Integration" }],
      required: true,
      default: [],
    },
    status: {
      type: String,
      enum: CONTROL_STATUSES,
      required: false,
      default: "NOT_IMPLEMENTED",
    },
  });

export default (mongoose.models
  .OrganizationControlMapping as mongoose.Model<OrgControlMappingWithDocument>) ||
  mongoose.model(
    "OrganizationControlMapping",
    OrganizationControlMappingSchema
  );