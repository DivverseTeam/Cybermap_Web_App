import mongoose from "mongoose";
import { z } from "zod";

import { BaseSchema } from "./base";

export const Evidence = z.object({
	id: z.string(),
	name: z.string(),
	organizationId: z.string().optional(),
	createdAt: z.coerce.date(),
});

export type Evidence = z.infer<typeof Evidence>;

type EvidenceWithDocument = Evidence & mongoose.Document;

const EvidenceSchema = new BaseSchema<EvidenceWithDocument>({
	name: {
		type: String,
	},
	organizationId: {
		type: String,
		required: false,
	},
});

export default (mongoose.models
	.Evidence as mongoose.Model<EvidenceWithDocument>) ||
	mongoose.model("Evidence", EvidenceSchema);
