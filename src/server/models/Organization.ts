import mongoose from "mongoose";
import { z } from "zod";
import {
	ORGANIZATION_INDUSTRIES,
	ORGANIZATION_KINDS,
	ORGANIZATION_SIZES,
	OrganizationIndustry,
	OrganizationKind,
	OrganizationSize,
} from "~/lib/types";
import { BaseSchema } from "./base";

export const Organization = z.object({
	id: z.string(),
	logoUrl: z.string().optional(),
	name: z.string(),
	size: OrganizationSize,
	kind: OrganizationKind,
	industry: OrganizationIndustry,
	frameworkIds: z.array(z.string()).optional().default([]),
	integrationIds: z.array(z.string()).optional().default([]),
});

export type Organization = z.infer<typeof Organization>;

type OrganizationWithDocument = Organization & mongoose.Document;

const OrganizationSchema = new BaseSchema<OrganizationWithDocument>({
	logoUrl: { type: String, required: false },
	name: { type: String, required: true },
	size: { type: String, enum: ORGANIZATION_SIZES, required: true },
	kind: {
		type: String,
		enum: ORGANIZATION_KINDS,
		required: true,
	},
	industry: {
		type: String,
		enum: ORGANIZATION_INDUSTRIES,
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
	.Organization as mongoose.Model<OrganizationWithDocument>) ||
	mongoose.model("Organization", OrganizationSchema);
