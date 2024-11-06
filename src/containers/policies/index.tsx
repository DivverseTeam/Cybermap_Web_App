"use client";

import { Button } from "~/app/_components/ui/button";
import { type Policy, columns } from "./columns";

import { useState } from "react";
import { DataTable } from "~/app/_components/table/data-table";
import { Popover, PopoverTrigger } from "~/app/_components/ui/popover";
import PageTitle from "~/components/PageTitle";
import AddPolicyPopover from "./components/AddPolicyPopover";

export default function Policies() {
	const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
	const data: Policy[] = [
		{
			id: "1",
			name: "Acceptance Use policy",
			frameworks: ["SOC 2 II", "HIPAA", "HIPAA", "PCI DSS", "PCI DSS"],
			lastApprovedOn: new Date("2024-09-19").toISOString(),
			lastDraft: new Date("2024-10-01").toISOString(),
			status: "APPROVED",
		},
		{
			id: "2",
			name: "Code of conduct",
			frameworks: ["SOC 2 II", "PCI DSS", "PCI DSS"],
			lastApprovedOn: null,
			lastDraft: new Date("2024-10-14").toISOString(),
			status: "DRAFT",
		},
		{
			id: "3",
			name: "Incident Response Plan",
			frameworks: ["HIPAA", "HIPAA", "ISO27001", "PCI DSS"],
			lastApprovedOn: null,
			lastDraft: new Date("2024-10-14").toISOString(),
			status: "DRAFT",
		},
		{
			id: "4",
			name: "Backup policy",
			frameworks: ["SOC 2 II", "HIPAA", "HIPAA", "ISO27001"],
			lastApprovedOn: null,
			lastDraft: new Date("2024-10-10").toISOString(),
			status: "DRAFT",
		},
		{
			id: "5",
			name: "Data protection policy",
			frameworks: ["SOC 2 II", "HIPAA", "HIPAA"],
			lastApprovedOn: null,
			lastDraft: new Date("2024-10-13").toISOString(),
			status: "DRAFT",
		},
		{
			id: "6",
			name: "Data classification policy",
			frameworks: ["SOC 2 II", "SOC 2 II", "HIPAA"],
			lastApprovedOn: new Date("2024-03-20").toISOString(),
			lastDraft: new Date("2024-09-14").toISOString(),
			status: "PENDING",
		},
		{
			id: "7",
			name: "Data retention policy",
			frameworks: ["SOC 2 II", "HIPAA", "HIPAA"],
			lastApprovedOn: null,
			lastDraft: new Date("2024-03-01").toISOString(),
			status: "DRAFT",
		},
		{
			id: "8",
			name: "Data protection policy",
			frameworks: ["SOC 2 II", "HIPAA", "HIPAA"],
			lastApprovedOn: null,
			lastDraft: new Date("2024-10-10").toISOString(),
			status: "DRAFT",
		},
	];

	return (
		<div className="flex flex-col gap-6">
			<PageTitle
				title="Policies"
				subtitle="View and edit your policies"
				action={
					<Popover onOpenChange={setIsPopoverOpen}>
						<PopoverTrigger asChild>
							<Button>Add Custom Policy</Button>
						</PopoverTrigger>
						<AddPolicyPopover />
					</Popover>
				}
			/>

			{isPopoverOpen ? (
				<div className="fixed inset-0 z-30 bg-black bg-opacity-60"></div>
			) : null}

			<DataTable columns={columns} data={data} />
		</div>
	);
}
