import mongoose, { Schema } from "mongoose";
import { z } from "zod";

import { BaseSchema } from "./base";

export const EvidenceLibrary = z.object({
  id: z.string(),
  fileName: z.string(),
  key: z.string(),
  linkedControls: z.array(z.string()),
  organisationId: z.string(),
  createdAt: z.coerce.date(),
});

export type EvidenceLibrary = z.infer<typeof EvidenceLibrary>;

type EvidenceLibraryWithDocument = EvidenceLibrary & mongoose.Document;

const EvidenceLibrarySchema = new BaseSchema<EvidenceLibraryWithDocument>({
  fileName: { type: String, required: true },
  key: { type: String, required: true },
  linkedControls: {
    // @ts-ignore
    type: [{ type: Schema.Types.ObjectId, ref: "Control" }],
    required: true,
    default: [],
  },
  // @ts-ignore
  organisationId: {
    type: Schema.Types.ObjectId, // Use ObjectId if it's an identifier
    required: true,
  },
});

export default (mongoose.models
  .EvidenceLibrary as mongoose.Model<EvidenceLibraryWithDocument>) ||
  mongoose.model("EvidenceLibrary", EvidenceLibrarySchema);
