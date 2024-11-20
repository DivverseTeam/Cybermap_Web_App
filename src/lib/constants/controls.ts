import { FRAMEWORKS_ENUM } from "./frameworks";

enum CONTROL_STATUS_ENUM {
  NOT_IMPLEMENTED = "Not implemented",
  PARTIALLY_IMPLEMENTED = "Partially implemented",
  FULLY_IMPLEMENTED = "Fully implemented",
}

export interface IControl {
  id: string;
  name: string;
  // description: string;
  mapped: FRAMEWORKS_ENUM[] | [];
  createdAt?: string;
  updatedAt?: string;
}

export interface IUserControlResponse {
  id: string;
  name: string;
  code: string;
  mapped: string[];
  userId: string;
  status: CONTROL_STATUS_ENUM;
}

const CONTROLS = [
  {
    id: "671b6ca27266734d282a9909",
    name: "Information Security Policies",
    code: "ISP",
    mapped: [FRAMEWORKS_ENUM.ISO27001],
  },
  {
    id: "671b7544f393863ecab261d0",
    name: "Organization of Information Security",
    code: "OIS",
    mapped: [FRAMEWORKS_ENUM.ISO27001],
  },
  {
    id: "671b7f1530a93cdba4055bcb",
    name: "Human Resource Security",
    code: "HRS",
    mapped: [FRAMEWORKS_ENUM.ISO27001],
  },
  {
    id: "671b8179d788bba526ff9d36",
    name: "Asset Management",
    code: "ASM",
    mapped: [FRAMEWORKS_ENUM.ISO27001],
  },
  {
    id: "671b8dd2efa6d666d0645802",
    name: "Access Control",
    code: "ACC",
    mapped: [FRAMEWORKS_ENUM.ISO27001, FRAMEWORKS_ENUM.SOC2],
  },
  {
    id: "671b8f9ba03a86d81eb9f992",
    name: "Cryptography",
    code: "CRY",
    mapped: [FRAMEWORKS_ENUM.ISO27001],
  },
  {
    id: "671bc1f188865f994ae3e9ea",
    name: "Physical and Environmental Security",
    code: "PES",
    mapped: [FRAMEWORKS_ENUM.ISO27001],
  },
  {
    id: "671bc24e88865f994ae3e9fe",
    name: "Operations Security",
    code: "OPS",
    mapped: [FRAMEWORKS_ENUM.ISO27001],
  },
  {
    id: "671bc0fc88865f994ae3e9c9",
    name: "Communications Security",
    code: "COM",
    mapped: [FRAMEWORKS_ENUM.ISO27001],
  },
  {
    id: "671bbf4588865f994ae3e977",
    name: "System Acquisition, Development, and Maintenance",
    code: "ADM",
    mapped: [FRAMEWORKS_ENUM.ISO27001],
  },
  {
    id: "671bbe6888865f994ae3e942",
    name: "Information Security Incident Management",
    code: "ISM",
    mapped: [FRAMEWORKS_ENUM.ISO27001],
  },
  {
    id: "671b94eec0e12e288bbbb0e7",
    name: "Information Security Aspects of Business Continuity Management",
    code: "BCM",
    mapped: [FRAMEWORKS_ENUM.ISO27001],
  },
  {
    id: "671b93c0c0e12e288bbbb0bd",
    name: "Compliance",
    code: "CMP",
    mapped: [FRAMEWORKS_ENUM.ISO27001],
  },
];

const USER_CONTROL_MAPPING_DATA = [
  {
    id: "671b6ca27266734d282a9909",
    name: "Information Security Policies",
    code: "ISP",
    mapped: ["ISO27001"],
    userId: "66ffec2cefd60bad27da301e",
    status: CONTROL_STATUS_ENUM.NOT_IMPLEMENTED,
  },
  {
    id: "871b6ca27266734d282a9901",
    name: "Access Control",
    code: "AC",
    mapped: ["ISO27001", "SOC2"],
    userId: "66ffec2cefd60bad27da301e",
    status: CONTROL_STATUS_ENUM.PARTIALLY_IMPLEMENTED,
  },
  {
    id: "a71b6ca27266734d282a9902",
    name: "Asset Management",
    code: "AM",
    mapped: ["ISO27001"],
    userId: "66ffec2cefd60bad27da301e",
    status: CONTROL_STATUS_ENUM.FULLY_IMPLEMENTED,
  },
  {
    id: "b71b6ca27266734d282a9903",
    name: "Physical Security",
    code: "PS",
    mapped: ["ISO27001"],
    userId: "66ffec2cefd60bad27da301e",
    status: CONTROL_STATUS_ENUM.NOT_IMPLEMENTED,
  },
  {
    id: "c71b6ca27266734d282a9904",
    name: "Incident Management",
    code: "IM",
    mapped: ["ISO27001"],
    userId: "66ffec2cefd60bad27da301e",
    status: CONTROL_STATUS_ENUM.PARTIALLY_IMPLEMENTED,
  },
  {
    id: "d71b6ca27266734d282a9905",
    name: "Risk Assessment",
    code: "RA",
    mapped: ["ISO27001"],
    userId: "66ffec2cefd60bad27da301e",
    status: CONTROL_STATUS_ENUM.FULLY_IMPLEMENTED,
  },
  {
    id: "e71b6ca27266734d282a9906",
    name: "Cryptography",
    code: "CR",
    mapped: ["ISO27001"],
    userId: "66ffec2cefd60bad27da301e",
    status: CONTROL_STATUS_ENUM.NOT_IMPLEMENTED,
  },
  {
    id: "f71b6ca27266734d282a9907",
    name: "Supplier Relationships",
    code: "SR",
    mapped: ["ISO27001"],
    userId: "66ffec2cefd60bad27da301e",
    status: CONTROL_STATUS_ENUM.PARTIALLY_IMPLEMENTED,
  },
  {
    id: "g71b6ca27266734d282a9908",
    name: "Human Resources Security",
    code: "HR",
    mapped: ["ISO27001"],
    userId: "66ffec2cefd60bad27da301e",
    status: CONTROL_STATUS_ENUM.FULLY_IMPLEMENTED,
  },
  {
    id: "h71b6ca27266734d282a9909",
    name: "Business Continuity Management",
    code: "BCM",
    mapped: ["ISO27001"],
    userId: "66ffec2cefd60bad27da301e",
    status: CONTROL_STATUS_ENUM.NOT_IMPLEMENTED,
  },
];

const getUserControlMapping = (userId: string) => {
  const aggregationPipeline = [
    {
      $lookup: {
        from: "USER_CONTROL_MAPPING",
        localField: "id",
        foreignField: "controlId",
        as: "userMapping",
      },
    },
    {
      $unwind: "$userMapping",
    },
    {
      $match: {
        "userMapping.userId": userId,
      },
    },
    {
      $project: {
        id: 1,
        name: 1,
        code: 1,
        mapped: 1,
        userId: "$userMapping.userId",
        status: "$userMapping.status",
      },
    },
  ];

  return aggregationPipeline;
};

export { CONTROLS, CONTROL_STATUS_ENUM, USER_CONTROL_MAPPING_DATA };
