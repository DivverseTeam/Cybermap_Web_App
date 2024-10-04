import { z } from "zod";

export const USER_ROLES = ["ADMIN", "COMPLIANCE_OFFICER", "AUDITOR"] as const;

export const UserRole = z.enum([...USER_ROLES]);
export type UserRole = z.infer<typeof UserRole>;

export const ORGANIZATION_KINDS = [
	"BOOTSTRAPPED_TECH_STARTUP",
	"SOFTWARE_AND_DESIGN_AGENCY",
	"FREELANCE_AND_SOLOPRENEUR",
	"ECOMMERCE_BUSINESS",
	"SMALL_CONSULTING_AND_ADVISORY_FIRM",
	"VC_FIRM",
	"UNIVERSITY",
	"OTHER",
] as const;
export const OrganizationKind = z.enum([...ORGANIZATION_KINDS]);
export type OrganizationKind = z.infer<typeof OrganizationKind>;

export const ORGANIZATION_INDUSTRIES = [
	"HEALTHCARE",
	"FINANCIAL_SERVICES",
	"GOVERNMENT_AND_DEFENSE",
	"ENERGY_AND_UTILITIES",
	"RETAIL_AND_ECOMMERCE",
	"EDUCATION",
	"TELECOMMUNICATIONS",
	"MANUFACTURING",
	"PHARMACEUTICAL_AND_LIFE_SCIENCES",
	"INSURANCE",
	"AEROSPACE",
	"LEGAL_AND_PROFESSIONAL_SERVICES",
	"TRANSPORTATION_AND_LOGISTICS",
	"MEDIA_AND_ENTERTAINMENT",
	"HOSPITALITY",
] as const;
export const OrganizationIndustry = z.enum([...ORGANIZATION_INDUSTRIES]);
export type OrganizationIndustry = z.infer<typeof OrganizationIndustry>;

export const ORGANIZATION_SIZES = [
	"1-10_MICRO",
	"11-50_SMALL",
	"51-250_MEDIUM",
	"251-1000_LARGE",
	"+1000_ENTERPRISE",
] as const;
export const OrganizationSize = z.enum([...ORGANIZATION_SIZES]);
export type OrganizationSize = z.infer<typeof OrganizationSize>;

export const PRESIGNED_URL_TYPES = ["ORGANIZATION_LOGO"] as const;
