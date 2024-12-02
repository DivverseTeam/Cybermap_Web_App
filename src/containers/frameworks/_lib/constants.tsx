"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { Button } from "~/app/_components/ui/button";
import TagsContainer from "~/components/TagContainer";

const FrameworkStatus = z.enum([
  "FULLY_IMPLEMENTED",
  "NOT_IMPLEMENTED",
  "PARTIALLY_IMPLEMENTED",
]);
type FrameworkStatus = z.infer<typeof FrameworkStatus>;

const FrameComplianceType = z.object({
  id: z.string(),
  control: z.string(),
  mapped: z.string().array(),
  status: FrameworkStatus,
});

export type FrameComplianceType = z.infer<typeof FrameComplianceType>;

export const frameworkData = [
  {
    id: "CB203",
    control: "Incident Response Plan",
    mapped: ["SOC 2 II", "HIPAA", "+4"],
    status: FrameworkStatus.Values.FULLY_IMPLEMENTED,
  },
  {
    id: "CB212",
    control: "Incident Response Plan",
    mapped: ["SOC 2 II", "PCI DSS"],
    status: FrameworkStatus.Values.NOT_IMPLEMENTED,
  },
  {
    id: "CB23",
    control: "Incident Response Plan",
    mapped: ["HIPAA", "ISO27001"],
    status: FrameworkStatus.Values.PARTIALLY_IMPLEMENTED,
  },
  {
    id: "CB24",
    control: "Incident Response Plan",
    mapped: ["SOC 2 II", "HIPAA", "+1"],
    status: FrameworkStatus.Values.FULLY_IMPLEMENTED,
  },
  {
    id: "CB25",
    control: "Incident Response Plan",
    mapped: ["SOC 2 II", "HIPAA", "+1"],
    status: FrameworkStatus.Values.PARTIALLY_IMPLEMENTED,
  },
  {
    id: "CB26",
    control: "Incident Response Plan",
    mapped: ["SOC 2 II", "HIPAA", "+1"],
    status: FrameworkStatus.Values.FULLY_IMPLEMENTED,
  },
  {
    id: "CB27",
    control: "Incident Response Plan",
    mapped: ["SOC 2 II", "HIPAA", "+1"],
    status: FrameworkStatus.Values.NOT_IMPLEMENTED,
  },
  {
    id: "CB28",
    control: "Incident Response Plan",
    mapped: ["SOC 2 II", "HIPAA", "+1"],
    status: FrameworkStatus.Values.PARTIALLY_IMPLEMENTED,
  },
];

export const frameworkDataColumns: ColumnDef<FrameComplianceType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "control",
    header: "Control",
    cell: ({ getValue }) => {
      const control = getValue<string[]>();
      return <span className="text-gray-normal text-sm">{control}</span>;
    },
  },
  {
    accessorKey: "mapped",
    header: "Mapped",
    cell: ({ getValue }) => {
      const frameworks = getValue<string[]>();
      return <TagsContainer tags={frameworks} />;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue<FrameworkStatus>();
      const cn = (c: string) =>
        twMerge(
          "font-medium text-xs p-2 flex items-center justify-center rounded-[1000px] w-fit h-5",
          c,
        );
      if (status === FrameworkStatus.Values.FULLY_IMPLEMENTED) {
        return (
          <div className={cn("bg-positive-subtle text-positive-intense")}>
            Fully implemented
          </div>
        );
      }
      if (status === FrameworkStatus.Values.NOT_IMPLEMENTED) {
        return (
          <div className={cn("bg-negative-subtle text-negative-intense")}>
            Not implemented
          </div>
        );
      }
      if (status === FrameworkStatus.Values.PARTIALLY_IMPLEMENTED) {
        return (
          <div className={cn("bg-notice-subtle text-notice-intense")}>
            Partially implemented
          </div>
        );
      }
      return <span></span>;
    },
  },
  {
    accessorKey: "id",
    header: "",
    cell: ({ getValue: _ }) => {
      return (
        <Button variant="outline" size="sm">
          <p className="font-medium text-neutral-12 text-xs">View control</p>
        </Button>
      );
    },
  },
];

export const frameworkIcons = {
  hipaa: "/frameworkIcons/hipaa.svg",
  hitech: "/frameworkIcons/hitech.svg",
  soc2I: "/frameworkIcons/soc2I.svg",
  soc2II: "/frameworkIcons/soc2I.svg",
  iso27001: "/frameworkIcons/iso27001.svg",
  pcidss: "/frameworkIcons/pcidss.svg",
  gdpr: "/frameworkIcons/gdpr.svg",
};

export const frameworkList = [
  {
    name: "HIPAA",
    keyVal: "hipaa",
    icon: "/frameworkIcons/hipaa.svg",
    complianceScore: [
      {
        name: "Passing",
        value: 120,
        color: "#09D886",
        // icon: <CircleCheck className="text-[#09D886]" />,
      },
      {
        name: "Failing",
        value: 35,
        color: "#D92D20",
        // icon: <CircleX className="text-destructive" />,
      },
      {
        name: "At risk",
        value: 5,
        color: "#FFDC00",
        // icon: <TriangleAlert className="text-[#FFDC00]" />,
      },
    ],
  },
  {
    name: "HITECH",
    keyVal: "hitech",
    icon: "/frameworkIcons/hitech.svg",
    complianceScore: [
      {
        name: "Passing",
        value: 65,
        color: "#09D886",
        // icon: <CircleCheck className="text-[#09D886]" />,
      },
      {
        name: "Failing",
        value: 75,
        color: "#D92D20",
        // icon: <CircleX className="text-destructive" />,
      },
      {
        name: "At risk",
        value: 20,
        color: "#FFDC00",
        // icon: <TriangleAlert className="text-[#FFDC00]" />,
      },
    ],
  },
  {
    name: "SOC 2 I",
    keyVal: "soc2I",
    icon: "/frameworkIcons/soc2I.svg",
    complianceScore: [
      {
        name: "Passing",
        value: 80,
        color: "#09D886",
        // icon: <CircleCheck className="text-[#09D886]" />,
      },
      {
        name: "Failing",
        value: 20,
        color: "#D92D20",
        // icon: <CircleX className="text-destructive" />,
      },
      {
        name: "At risk",
        value: 60,
        color: "#FFDC00",
        // icon: <TriangleAlert className="text-[#FFDC00]" />,
      },
    ],
  },
  {
    name: "SOC 2 II",
    keyVal: "soc2II",
    icon: "/frameworkIcons/soc2I.svg",
    complianceScore: [
      {
        name: "Passing",
        value: 60,
        color: "#09D886",
        // icon: <CircleCheck className="text-[#09D886]" />,
      },
      {
        name: "Failing",
        value: 80,
        color: "#D92D20",
        // icon: <CircleX className="text-destructive" />,
      },
      {
        name: "At risk",
        value: 20,
        color: "#FFDC00",
        // icon: <TriangleAlert className="text-[#FFDC00]" />,
      },
    ],
  },
  {
    name: "ISO 27001",
    keyVal: "iso27001",
    icon: "/frameworkIcons/iso27001.svg",
    complianceScore: [
      {
        name: "Passing",
        value: 140,
        color: "#09D886",
        // icon: <CircleCheck className="text-[#09D886]" />,
      },
      {
        name: "Failing",
        value: 15,
        color: "#D92D20",
        // icon: <CircleX className="text-destructive" />,
      },
      {
        name: "At risk",
        value: 5,
        color: "#FFDC00",
        // icon: <TriangleAlert className="text-[#FFDC00]" />,
      },
    ],
  },
  {
    name: "PCI DSS",
    keyVal: "pcidss",
    icon: "/frameworkIcons/pcidss.svg",
    complianceScore: [
      {
        name: "Passing",
        value: 100,
        color: "#09D886",
        // icon: <CircleCheck className="text-[#09D886]" />,
      },
      {
        name: "Failing",
        value: 30,
        color: "#D92D20",
        // icon: <CircleX className="text-destructive" />,
      },
      {
        name: "At risk",
        value: 30,
        color: "#FFDC00",
        // icon: <TriangleAlert className="text-[#FFDC00]" />,
      },
    ],
  },
  {
    name: "GDPR",
    keyVal: "gdpr",
    icon: "/frameworkIcons/gdpr.svg",
    complianceScore: [
      {
        name: "Passing",
        value: 150,
        color: "#09D886",
        // icon: <CircleCheck className="text-[#09D886]" />,
      },
      {
        name: "Failing",
        value: 0,
        color: "#D92D20",
        // icon: <CircleX className="text-destructive" />,
      },
      {
        name: "At risk",
        value: 10,
        color: "#FFDC00",
        // icon: <TriangleAlert className="text-[#FFDC00]" />,
      },
    ],
  },
];

export const getProgressColor = (progress: number) => {
  if (progress > 80) return "#218358";
  if (progress > 50) return "#305EFF";
  if (progress < 50) return "#CE2C31";
};
