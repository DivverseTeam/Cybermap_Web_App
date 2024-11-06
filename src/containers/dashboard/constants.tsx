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

export const frameworkdata = [
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
		id: "CB2",
		control: "Incident Response Plan",
		mapped: ["SOC 2 II", "HIPAA", "+1"],
		status: FrameworkStatus.Values.FULLY_IMPLEMENTED,
	},
	{
		id: "CB2",
		control: "Incident Response Plan",
		mapped: ["SOC 2 II", "HIPAA", "+1"],
		status: FrameworkStatus.Values.PARTIALLY_IMPLEMENTED,
	},
	{
		id: "CB2",
		control: "Incident Response Plan",
		mapped: ["SOC 2 II", "HIPAA", "+1"],
		status: FrameworkStatus.Values.FULLY_IMPLEMENTED,
	},
	{
		id: "CB2",
		control: "Incident Response Plan",
		mapped: ["SOC 2 II", "HIPAA", "+1"],
		status: FrameworkStatus.Values.NOT_IMPLEMENTED,
	},
	{
		id: "CB2",
		control: "Incident Response Plan",
		mapped: ["SOC 2 II", "HIPAA", "+1"],
		status: FrameworkStatus.Values.PARTIALLY_IMPLEMENTED,
	},
];

export const frameworkdataColumns: ColumnDef<FrameComplianceType>[] = [
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
					<p className="text-xs text-neutral-12 font-medium">View control</p>
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

export const frameworklist = [
	{
		framework: "HIPAA",
		keyVal: "hipaa",
		progress: "72",
		score: "120/160",
	},
	{
		framework: "HITECH",
		keyVal: "hitech",
		progress: "0",
		score: "0/120",
	},
	{
		framework: "SOC 2 I",
		keyVal: "soc2I",
		progress: "72",
		score: "120/160",
	},
	{
		framework: "SOC 2 II",
		keyVal: "soc2II",
		progress: "72",
		score: "120/160",
	},
	{
		framework: "ISO 27001",
		keyVal: "iso27001",
		progress: "5",
		score: "120/160",
	},
	{
		framework: "PCI DSS",
		keyVal: "pcidss",
		progress: "72",
		score: "120/160",
	},
	{
		framework: "GDPR",
		keyVal: "gdpr",
		progress: "93",
		score: "155/160",
	},
] as const;

export const getProgressColor = (progress: number) => {
	if (progress > 80) return "#218358";
	if (progress > 50) return "#305EFF";
	if (progress < 50) return "#CE2C31";
};
