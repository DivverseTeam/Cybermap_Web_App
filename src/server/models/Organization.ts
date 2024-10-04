import mongoose from "mongoose";
import {
	ORGANIZATION_INDUSTRIES,
	ORGANIZATION_KINDS,
	ORGANIZATION_SIZES,
	type OrganizationIndustry,
	type OrganizationKind,
	type OrganizationSize,
} from "~/lib/types";

export interface Organization extends mongoose.Document {
	id: string;
	logoUrl?: string;
	name: string;
	size: OrganizationSize;
	kind: OrganizationKind;
	industry: OrganizationIndustry;
	frameworkIds: Array<string>;
	integrationIds: Array<string>;
}

const OrganizationSchema = new mongoose.Schema<Organization>({
	id: {
		type: String,
		required: true,
		unique: true,
	},
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

export default (mongoose.models.Organization as mongoose.Model<Organization>) ||
	mongoose.model("Organization", OrganizationSchema);
