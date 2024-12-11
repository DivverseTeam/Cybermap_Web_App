import mongoose, { Schema, Types } from "mongoose";
import { z } from "zod";

import { CONTROL_STATUSES } from "~/lib/constants/controls";
import { ControlStatus } from "~/lib/types/controls";
import { BaseSchema } from "./base";

export const UserControlMapping = z.object({
  id: z.string(),
  controlId: z.string().refine((id) => Types.ObjectId.isValid(id), {
    message: "Invalid ObjectId for controlId",
  }),
  organisationId: z.string().refine((id) => Types.ObjectId.isValid(id), {
    message: "Invalid ObjectId for controlId",
  }),
  status: ControlStatus,
});

export type UserControlMapping = z.infer<typeof UserControlMapping>;

type UserControlMappingWithDocument = UserControlMapping & mongoose.Document;

const UserControlMappingSchema = new BaseSchema<UserControlMappingWithDocument>(
  {
    //TODO: Fix this types
    //@ts-ignore
    controlId: {
      type: Schema.Types.ObjectId,
      ref: "Control",
      required: true,
    },
    //@ts-ignore
    organisationId: {
      type: Schema.Types.ObjectId,
      ref: "Organisation",
      required: true,
    },
    status: {
      type: String,
      enum: CONTROL_STATUSES,
      required: false,
      default: "NOT_IMPLEMENTED",
    },
  },
);

export default (mongoose.models
  .UserControlMapping as mongoose.Model<UserControlMappingWithDocument>) ||
  mongoose.model("UserControlMapping", UserControlMappingSchema);
