import mongoose from "mongoose";
import { z } from "zod";
import {
	ORGANISATION_INDUSTRIES,
	ORGANISATION_KINDS,
	ORGANISATION_SIZES,
	OrganisationIndustry,
	OrganisationKind,
	OrganisationSize,
} from "~/lib/types";
import { BaseSchema } from "./base";

export const Organisation = z.object({
	id: z.string(),
	logoUrl: z.string().optional(),
	name: z.string(),
	size: OrganisationSize,
	kind: OrganisationKind,
	industry: OrganisationIndustry,
	frameworkIds: z.array(z.string()).optional().default([]),
	integrationIds: z.array(z.string()).optional().default([]),
});

export type Organisation = z.infer<typeof Organisation>;

type OrganisationWithDocument = Organisation & mongoose.Document;

const OrganisationSchema = new BaseSchema<OrganisationWithDocument>({
	logoUrl: { type: String, required: false },
	name: { type: String, required: true },
	size: { type: String, enum: ORGANISATION_SIZES, required: true },
	kind: {
		type: String,
		enum: ORGANISATION_KINDS,
		required: true,
	},
	industry: {
		type: String,
		enum: ORGANISATION_INDUSTRIES,
		required: true,
	},
	frameworkIds: {
		type: [{ type: String }],
		required: false,
		default: [],
	},
	integrationIds: {
		type: [{ type: String }],
		required: false,
		default: [],
	},
});

export default (mongoose.models
	.Organisation as mongoose.Model<OrganisationWithDocument>) ||
	mongoose.model("Organisation", OrganisationSchema);
