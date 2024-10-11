import { columns } from "./_colums";
import { DataTable } from "./_data-table";

export default function page() {
	const data = [
		{
			name: "Policy 1",
			frameworks: ["React", "Next.js"],
			lastApprovedOn: new Date("2023-05-01").toISOString(),
			lastDraft: new Date("2023-04-15").toISOString(),
			status: "pending" as any,
		},
		{
			name: "Policy 2",
			frameworks: ["Angular", "Vue.js"],
			lastApprovedOn: new Date("2023-04-20").toISOString(),
			lastDraft: new Date("2023-04-10").toISOString(),
			status: "processing" as any,
		},
	];

	return (
		<div className="container mx-auto py-10">
			<DataTable columns={columns} data={data} />
		</div>
	);
}
