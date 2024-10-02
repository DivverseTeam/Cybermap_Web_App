import mongoose from "mongoose";
import { z } from "zod";

export const ORGANISATION_KINDS = [
	"BOOTSTRAPPED_TECH_STARTUP",
	"SOFTWARE_AND_DESIGN_AGENCY",
	"FREELANCE_AND_SOLOPRENEUR",
	"ECOMMERCE_BUSINESS",
	"SMALL_CONSULTING_AND_ADVISORY_FIRM",
	"VC_FIRM",
	"UNIVERSITY",
	"OTHER",
] as const;
export const OrganisationKind = z.enum([...ORGANISATION_KINDS]);
export type OrganisationKind = z.infer<typeof OrganisationKind>;

export const ORGANISATION_INDUSTRIES = [
	"INFORMATION_AND_TECHNOLOGY",
	"FINANCIAL_SERVICES",
	"REAL_ESTATE",
	"OIL_AND_ENERGY",
	"MEDIA_AND_ENTERTAINMENT",
] as const;
export const OrganisationIndustry = z.enum([...ORGANISATION_INDUSTRIES]);
export type OrganisationIndustry = z.infer<typeof OrganisationIndustry>;

export const ORGANISATION_SIZES = [
	"1-10_MICRO",
	"11-50_SMALL",
	"51-250_MEDIUM",
	"251-1000_LARGE",
	"+1000_ENTERPRISE",
] as const;
export const OrganisationSize = z.enum([...ORGANISATION_SIZES]);
export type OrganisationSize = z.infer<typeof OrganisationSize>;

export interface Organisation extends mongoose.Document {
	logoUrl?: string;
	name: string;
	size: OrganisationSize;
	kind: OrganisationKind;
	industry: OrganisationIndustry;
	frameworkIds: Array<string>;
	integrationIds: Array<string>;
}

const OrganisationSchema = new mongoose.Schema<Organisation>({
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

export default (mongoose.models.Organisation as mongoose.Model<Organisation>) ||
	mongoose.model("Organisation", OrganisationSchema);
