enum FRAMEWORKS_ENUM {
  SOC2 = "SOC2",
  ISO27001 = "ISO27001",
  HIPAA = "HIPAA",
  GDPR = "GDPR",
  PCIDSS = "PCI-DSS",
}

export interface IFramework { 
  id: string;
  name: FRAMEWORKS_ENUM;
  code: string;
}

const FRAMEWORKS = [
  {
    id: "66ffec2cefd60bad27da301e",
    name: FRAMEWORKS_ENUM.ISO27001,
    code: "ISP",
  },
  {
    id: "66ffec2cefd60bad27da301f",
    name: FRAMEWORKS_ENUM.SOC2,
    code: "OIS",
  },
  {
    id: "66ffec2cefd60bad27da302f",
    name: FRAMEWORKS_ENUM.HIPAA,
    code: "HRS",
  },
  {
    id: "66ffec2cefd60bad27da3030",
    name: FRAMEWORKS_ENUM.GDPR,
    code: "ASM",
  },
  {
    id: "66ffec2cefd60bad27da3034",
    name: FRAMEWORKS_ENUM.PCIDSS,
    code: "ACC",
  },
];

export { FRAMEWORKS_ENUM, FRAMEWORKS };
