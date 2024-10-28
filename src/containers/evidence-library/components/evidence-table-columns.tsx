import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useState, useEffect, useTransition } from "react";
import { IEvidence } from "../types";

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

type Props = {};

const columnHelper = createColumnHelper();

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
                className="px-2 py-1 text-xs font-medium bg-gray-200 rounded-md"
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
  }),
  columnHelper.accessor("status", {
    header: () => (
      <span className="w-[110px] flex items-center text-center justify-center">
        Status
      </span>
    ), // Wrap in span
    cell: ({ cell }) => (
      <span
        className={`rounded-lg font-semibold text-xs flex items-center justify-center py-[2px] px-2 ${
          cell.getValue() === "Needs artifact"
            ? "bg-destructive/20 text-destructive"
            : "bg-green-700/20 text-green-700 "
        }`}
      >
        {cell.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("renewalDate", {
    header: () => <span>Renewal Date</span>, // Wrap in span
    cell: ({ cell }) => formatDate(cell.getValue() as Date),
  }),
  columnHelper.accessor("actions", {
    header: () => <span></span>, // Wrap in span
    cell: function Cell({ row }) {
      const [isUpdatePending, startUpdateTransition] = useTransition();
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
            evidence={row.original}
          />
          <DeleteEvidenceDialog
            open={showDeleteEvidenceDialog}
            onOpenChange={setShowDeleteEvidenceDialog}
            evidence={row.original}
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
              {/* <DropdownMenuSub>
                <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={row.original.label}
                    onValueChange={(value) => {
                      startUpdateTransition(() => {
                        toast.promise(
                          updateEvidence({
                            id: row.original.id,
                            label: value as Evidence["label"],
                          }),
                          {
                            loading: "Updating...",
                            success: "Label updated",
                            error: (err) => getErrorMessage(err),
                          }
                        );
                      });
                    }}
                  >
                    {tasks.label.enumValues.map((label) => (
                      <DropdownMenuRadioItem
                        key={label}
                        value={label}
                        className="capitalize"
                        disabled={isUpdatePending}
                      >
                        {label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub> */}
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
