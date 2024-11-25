import type { Control } from "../types/controls";

export const CONTROL_STATUSES = [
  "NOT_IMPLEMENTED",
  "PARTIALLY_IMPLEMENTED",
  "FULLY_IMPLEMENTED",
] as const;

export const controls: Array<Control> = [
  {
    id: "671b6ca27266734d282a9909",
    name: "Information Security Policies",
    code: "ISP",
    mapped: ["ISO27001"],
  },
  {
    id: "671b7544f393863ecab261d0",
    name: "Organization of Information Security",
    code: "OIS",
    mapped: ["ISO27001"],
  },
  {
    id: "671b7f1530a93cdba4055bcb",
    name: "Human Resource Security",
    code: "HRS",
    mapped: ["ISO27001"],
  },
  {
    id: "671b8179d788bba526ff9d36",
    name: "Asset Management",
    code: "ASM",
    mapped: ["ISO27001"],
  },
  {
    id: "671b8dd2efa6d666d0645802",
    name: "Access Control",
    code: "ACC",
    mapped: ["ISO27001", "SOC2"],
  },
  {
    id: "671b8f9ba03a86d81eb9f992",
    name: "Cryptography",
    code: "CRY",
    mapped: ["ISO27001"],
  },
  {
    id: "671bc1f188865f994ae3e9ea",
    name: "Physical and Environmental Security",
    code: "PES",
    mapped: ["ISO27001"],
  },
  {
    id: "671bc24e88865f994ae3e9fe",
    name: "Operations Security",
    code: "OPS",
    mapped: ["ISO27001"],
  },
  {
    id: "671bc0fc88865f994ae3e9c9",
    name: "Communications Security",
    code: "COM",
    mapped: ["ISO27001"],
  },
  {
    id: "671bbf4588865f994ae3e977",
    name: "System Acquisition, Development, and Maintenance",
    code: "ADM",
    mapped: ["ISO27001"],
  },
  {
    id: "671bbe6888865f994ae3e942",
    name: "Information Security Incident Management",
    code: "ISM",
    mapped: ["ISO27001"],
  },
  {
    id: "671b94eec0e12e288bbbb0e7",
    name: "Information Security Aspects of Business Continuity Management",
    code: "BCM",
    mapped: ["ISO27001"],
  },
  {
    id: "671b93c0c0e12e288bbbb0bd",
    name: "Compliance",
    code: "CMP",
    mapped: ["ISO27001"],
  },
];
