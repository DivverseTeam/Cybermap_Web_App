import { Button } from "~/app/_components/ui/button";
import { columns, type Policy } from "./_colums";
import { DataTable } from "./_data-table";

export default function page() {
	const data: Policy[] = [
		{
			name: "Acceptance Use policy",
			frameworks: ["SOC 2 II", "HIPAA", "HIPAA", "PCI DSS", "PCI DSS"],
			lastApprovedOn: new Date("2024-09-19").toISOString(),
			lastDraft: new Date("2024-10-01").toISOString(),
			status: "APPROVED",
		},
		{
			name: "Code of conduct",
			frameworks: ["SOC 2 II", "PCI DSS", "PCI DSS"],
			lastApprovedOn: null,
			lastDraft: new Date("2024-10-14").toISOString(),
			status: "DRAFT",
		},
		{
			name: "Incident Response Plan",
			frameworks: ["HIPAA", "HIPAA", "ISO27001", "PCI DSS"],
			lastApprovedOn: null,
			lastDraft: new Date("2024-10-14").toISOString(),
			status: "DRAFT",
		},
		{
			name: "Backup policy",
			frameworks: ["SOC 2 II", "HIPAA", "HIPAA", "ISO27001"],
			lastApprovedOn: null,
			lastDraft: new Date("2024-10-10").toISOString(),
			status: "DRAFT",
		},
		{
			name: "Data protection policy",
			frameworks: ["SOC 2 II", "HIPAA", "HIPAA"],
			lastApprovedOn: null,
			lastDraft: new Date("2024-10-13").toISOString(),
			status: "DRAFT",
		},
		{
			name: "Data classification policy",
			frameworks: ["SOC 2 II", "SOC 2 II", "HIPAA"],
			lastApprovedOn: new Date("2024-03-20").toISOString(),
			lastDraft: new Date("2024-09-14").toISOString(),
			status: "PENDING",
		},
		{
			name: "Data retention policy",
			frameworks: ["SOC 2 II", "HIPAA", "HIPAA"],
			lastApprovedOn: null,
			lastDraft: new Date("2024-03-01").toISOString(),
			status: "DRAFT",
		},
		{
			name: "Data protection policy",
			frameworks: ["SOC 2 II", "HIPAA", "HIPAA"],
			lastApprovedOn: null,
			lastDraft: new Date("2024-10-10").toISOString(),
			status: "DRAFT",
		},
	];

	return (
		<div className="container mx-auto p-12">
			<div className="mb-10 flex items-end justify-between">
				<div>
					<h2 className="mb-2 text-2xl">Policies</h2>
					<span className="text-[#757575]">View and edit your policies</span>
				</div>
				<div>
					<Button>Add Custom Policy</Button>
				</div>
			</div>
			<DataTable columns={columns} data={data} />
		</div>
	);
}
