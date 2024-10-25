"use client";

import { DownloadIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";

import { exportTableToCSV } from "~/lib/export";
import { Button } from "~/app/_components/ui/button";

import { CreateEvidenceSheet } from "./create-evidence-sheet";
import { DeleteEvidencesDialog } from "./delete-evidences-dialog";
import { Evidence } from "../_lib/queries";

interface EvidencesTableToolbarActionsProps {
	table: Table<Evidence>;
}

export function EvidencesTableToolbarActions({
	table,
}: EvidencesTableToolbarActionsProps) {
	return (
		<div className="flex items-center gap-2">
			{table.getFilteredSelectedRowModel().rows.length > 0 ? (
				// @ts-expect-error - bcoz we are also Drawer Component for Mobile view
				// and on Drawer Component its mandatory to pass open & openChange prop
				<DeleteTasksDialog
					tasks={table
						.getFilteredSelectedRowModel()
						.rows.map((row) => row.original)}
					onSuccess={() => table.toggleAllRowsSelected(false)}
				/>
			) : null}
			<CreateEvidenceSheet />
			<Button
				variant="outline"
				size="sm"
				onClick={() =>
					exportTableToCSV(table, {
						filename: "evidences",
						excludeColumns: ["select", "actions"],
					})
				}
			>
				<DownloadIcon className="mr-2 size-4" aria-hidden="true" />
				Export
			</Button>
			{/**
			 * Other actions can be added here.
			 * For example, import, view, etc.
			 */}
		</div>
	);
}
