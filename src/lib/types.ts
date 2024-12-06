import { z } from "zod";

export const USER_ROLES = ["ADMIN", "COMPLIANCE_OFFICER", "AUDITOR"] as const;

export const UserRole = z.enum([...USER_ROLES]);
export type UserRole = z.infer<typeof UserRole>;

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

export const PRESIGNED_URL_TYPES = [
  "ORGANISATION_LOGO",
  "POLICY_DOCUMENT",
] as const;

export const FRAMEWORK_NAMES = [
  "SOC2",
  "ISO27001",
  "HIPAA",
  "GDPR",
  "PCI-DSS",
] as const;
export const FrameworkName = z.enum(FRAMEWORK_NAMES);
export type FrameworkName = z.infer<typeof FrameworkName>;
