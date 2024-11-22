import type { Framework } from "../types/frameworks";

enum FRAMEWORKS_ENUM {
  SOC2 = "SOC2",
  ISO27001 = "ISO27001",
  HIPAA = "HIPAA",
  GDPR = "GDPR",
  PCIDSS = "PCI-DSS",
}

export const FRAMEWORK_NAMES = [
  "SOC2",
  "ISO27001",
  "HIPAA",
  "GDPR",
  "PCI-DSS",
] as const;

export interface IFramework {
  id: string;
  name: FRAMEWORKS_ENUM;
  code: string;
}

export const frameworks: Array<Framework> = [
  {
    id: "66ffec2cefd60bad27da301e",
    name: "ISO27001",
    code: "ISP",
  },
  {
    id: "66ffec2cefd60bad27da301f",
    name: "SOC2",
    code: "OIS",
  },
  {
    id: "66ffec2cefd60bad27da302f",
    name: "HIPAA",
    code: "HRS",
  },
  {
    id: "66ffec2cefd60bad27da3030",
    name: "GDPR",
    code: "ASM",
  },
  {
    id: "66ffec2cefd60bad27da3034",
    name: "PCI-DSS",
    code: "ACC",
  },
];
