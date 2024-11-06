import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useEffect, useState, useTransition } from "react";
import type { IEvidence } from "../types";

import { DotsHorizontalIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import { Button } from "~/app/_components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import { formatDate } from "~/lib/utils";
import { DeleteEvidenceDialog } from "./delete-evidence-dialog";
import { ViewEvidenceSheet } from "./view-evidence-sheet";

type Props = {};

const columnHelper = createColumnHelper();

// const row: Row<IEvidence> =

export const columns: any = [
	columnHelper.accessor("name", {
		header: () => <span>File name</span>, // Wrap in span
	}),
	columnHelper.accessor("linkedControls", {
		header: () => <span>Linked Controls</span>, // Wrap in span
		cell: ({ row }) => {
			const linkedControls = row.getValue("linkedControls") as string[];
			return (
				<div className="flex flex-wrap gap-2">
					{linkedControls?.length ? (
						linkedControls.map((control, idx) => (
							<span
								key={idx}
								className="rounded-xl bg-[#0F78AD]/20 px-2 py-1 font-semibold text-[#0F78AD] text-xs"
							>
								{control}
							</span>
						))
					) : (
						<span className="text-gray-500 text-sm">No controls</span>
					)}
				</div>
			);
		},
	}),
	columnHelper.accessor("renewalDate", {
		header: () => <span className="">Renewal Date</span>, // Wrap in span
		cell: ({ cell }) => (
			<span className="text-sm "> {formatDate(cell.getValue() as Date)}</span>
		),
	}),
	columnHelper.accessor("status", {
		header: () => (
			<span className="flex w-[110px] items-center justify-center text-center">
				Status
			</span>
		), // Wrap in span
		cell: ({ cell }) => (
			<span
				className={`flex items-center justify-center rounded-xl px-2 py-[2px] font-medium text-xs ${
					cell.getValue() === "Needs artifact"
						? "bg-destructive/20 text-destructive"
						: "bg-green-700/20 text-green-700 "
				}`}
			>
				{cell.getValue()}
			</span>
		),
	}),

	columnHelper.accessor("actions", {
		header: () => <span></span>, // Wrap in span
		cell: function Cell({ row }) {
			const [_isUpdatePending, _startUpdateTransition] = useTransition();
			const [showUpdateEvidenceSheet, setShowUpdateEvidenceSheet] =
				useState(false);
			const [showDeleteEvidenceDialog, setShowDeleteEvidenceDialog] =
				useState(false);

			// console.log(row.original);

			return (
				<>
					<ViewEvidenceSheet
						open={showUpdateEvidenceSheet}
						onOpenChange={setShowUpdateEvidenceSheet}
						evidence={row.original as IEvidence}
					/>
					<DeleteEvidenceDialog
						open={showDeleteEvidenceDialog}
						onOpenChange={setShowDeleteEvidenceDialog}
						evidence={row.original as IEvidence}
						showTrigger={false}
						onSuccess={() => row.toggleSelected(false)}
					/>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								aria-label="Open menu"
								variant="ghost"
								className="mx-auto flex size-8 p-0 data-[state=open]:bg-muted"
							>
								<DotsVerticalIcon
									className="size-4 font-bold text-secondary"
									aria-hidden="true"
								/>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-40">
							<DropdownMenuItem
								onSelect={() => setShowUpdateEvidenceSheet(true)}
							>
								View
							</DropdownMenuItem>

							<DropdownMenuSeparator />
							<DropdownMenuItem
								onSelect={() => setShowDeleteEvidenceDialog(true)}
							>
								Delete
								<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</>
			);
		},
	}),
];
