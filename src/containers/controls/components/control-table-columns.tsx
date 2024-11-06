import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useEffect, useState, useTransition } from "react";

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

type Props = {};

const columnHelper = createColumnHelper();

// const row: Row<IEvidence> =

export const columns: any = [
	columnHelper.accessor("name", {
		header: () => <span>CONTROL</span>, // Wrap in span
		cell: ({ cell }) => <span className="">{cell.getValue()}</span>,
	}),
	columnHelper.accessor("mappedControls", {
		header: () => <span>MAPPED</span>, // Wrap in span
		cell: ({ row }) => {
			const mappedControls = row.getValue("mappedControls") as string[];
			return (
				<div className="flex flex-wrap gap-2">
					{mappedControls?.length ? (
						mappedControls.map((control, idx) => (
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
	columnHelper.accessor("status", {
		header: () => (
			<span className="flex w-[60px] items-center justify-center text-center">
				STATUS
			</span>
		), // Wrap in span
		cell: ({ cell }) => (
			<span
				className={`flex w-[150px] items-center justify-center rounded-xl px-2 py-[2px] font-medium text-xs ${
					cell.getValue() === "Not implemented"
						? "bg-destructive/20 text-destructive"
						: cell.getValue() === "Partially implemented"
							? "bg-[#C65C10]/20 text-[#C65C10]"
							: "bg-green-700/20 text-green-700 "
				}`}
			>
				{cell.getValue()}
			</span>
		),
	}),
];
