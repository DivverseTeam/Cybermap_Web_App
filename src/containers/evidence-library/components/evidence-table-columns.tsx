import type { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useState, useEffect, useTransition } from "react";
import type { IEvidence } from "../types";

import { DeleteEvidenceDialog } from "./delete-evidence-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import { formatDate } from "~/lib/utils";
import { Button } from "~/app/_components/ui/button";
import { DotsHorizontalIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import { ViewEvidenceSheet } from "./view-evidence-sheet";

// interface RowData {
//   name: string;
//   linkedControls: string[];
//   status: string;
//   renewalDate: Date;
//   actions?: never;
// }

// type RowData = IEvidence;
export const columns: ColumnDef<IEvidence>[] = [
  {
    accessorKey: "name",
    header: () => <span>File name</span>, // Wrap in span
  },
  {
    accessorKey: "linkedControls",
    header: () => <span>Linked Controls</span>, // Wrap in span
    cell: ({ row }) => {
      const linkedControls = row.getValue("linkedControls") as string[];
      return (
        <div className="flex flex-wrap gap-2">
          {linkedControls?.length ? (
            linkedControls.map((control, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs text-[#0F78AD] font-semibold bg-[#0F78AD]/20 rounded-xl"
              >
                {control}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500">No controls</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "renewalDate",
    header: () => <span className="">Renewal Date</span>, // Wrap in span
    cell: ({ cell }) => (
      <span className="text-sm "> {formatDate(cell.getValue() as Date)}</span>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <span className="w-[110px] flex items-center text-center justify-center">
        Status
      </span>
    ), // Wrap in span
    cell: ({ cell }) => (
      <span
        className={`rounded-xl font-medium text-xs flex items-center justify-center py-[2px] px-2 ${
          cell.getValue() === "Needs artifact"
            ? "bg-destructive/20 text-destructive"
            : "bg-green-700/20 text-green-700 "
        }`}
      >
        {cell.getValue() as string}
      </span>
    ),
  },

  {
    accessorKey: "actions",
    header: () => <span></span>, // Wrap in span
    cell: function Cell({ row }) {
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
            evidence={row.original as unknown as IEvidence}
          />
          <DeleteEvidenceDialog
            open={showDeleteEvidenceDialog}
            onOpenChange={setShowDeleteEvidenceDialog}
            evidence={row.original as unknown as IEvidence}
            showTrigger={false}
            onSuccess={() => row.toggleSelected(false)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted mx-auto"
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
  },
];
