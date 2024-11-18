import type { OrganisationIndustry } from "./types";

export const INDUSTRY_FRAMEWORK_MAP: Record<OrganisationIndustry, string[]> = {
  HEALTHCARE: ["HIPAA", "HITECH", "NIST_800-66", "ISO_27799"],
  FINANCIAL_SERVICES: ["PCI_DSS", "GLBA", "SOX", "FFIEC", "NIST_800-53"],
  GOVERNMENT_AND_DEFENSE: [
    "FedRAMP",
    "FISMA",
    "NIST_SP_800-171",
    "CMMC",
    "DFARS",
  ],
  ENERGY_AND_UTILITIES: ["NERC_CIP", "ISO_27001", "NIST_CSF", "DOE_C2M2"],
  RETAIL_AND_ECOMMERCE: ["PCI_DSS", "ISO_27001", "GDPR", "CCPA"],
  EDUCATION: ["FERPA", "COPPA", "ISO_27001", "NIST_CSF"],
  TELECOMMUNICATIONS: ["FCC_CPNI", "ISO_27001", "NIST_CSF"],
  MANUFACTURING: ["CMMC", "NIST_SP_800-171", "ISA/IEC_62443", "ISO_27001"],
  PHARMACEUTICAL_AND_LIFE_SCIENCES: [
    "21_CFR_Part_11",
    "HIPAA",
    "GDPR",
    "ISO_27001",
  ],
  INSURANCE: ["GLBA", "NIST_CSF", "PCI_DSS", "ISO_27001"],
  AEROSPACE: ["CMMC", "DFARS", "ISO_27001", "NIST_800-53"],
  LEGAL_AND_PROFESSIONAL_SERVICES: ["ISO_27001", "NIST_CSF", "ABA_Model_Rules"],
  TRANSPORTATION_AND_LOGISTICS: [
    "TSA_Cybersecurity_Directives",
    "ISO_27001",
    "NIST_CSF",
  ],
  MEDIA_AND_ENTERTAINMENT: [
    "MPAA_Content_Security_Best_Practices",
    "ISO_27001",
    "GDPR",
  ],
  HOSPITALITY: ["PCI_DSS", "GDPR", "CCPA"],
};

export const unknownError =
  "An unknown error occurred. Please try again later.";

// Below is for testing purposes
export const databasePrefix = "shadcn";
