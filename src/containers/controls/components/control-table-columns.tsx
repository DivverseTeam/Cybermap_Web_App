import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useState, useEffect, useTransition } from "react";

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
import type { IControl } from "../types";

// interface RowData {
//   name: string;
//   mappedControls: string[];
//   status: string;
// }
// const columnHelper = createColumnHelper<RowData>();

export const columns: ColumnDef<IControl>[] = [
  {
    accessorKey: "name",
    header: () => <span>CONTROL</span>, // Wrap in span
    cell: ({ cell }) => <span className="">{cell.getValue() as string}</span>,
  },
  {
    accessorKey: "mappedControls",
    header: () => <span>MAPPED</span>, // Wrap in span
    cell: ({ row }) => {
      const mappedControls = row.getValue("mappedControls") as string[];
      return (
        <div className="flex flex-wrap gap-2">
          {mappedControls?.length ? (
            mappedControls.map((control, idx) => (
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
    accessorKey: "status",
    header: () => (
      <span className="w-[60px] flex items-center text-center justify-center">
        STATUS
      </span>
    ), // Wrap in span
    cell: ({ cell }) => (
      <span
        className={`w-[150px] rounded-xl font-medium text-xs flex items-center justify-center py-[2px] px-2 ${
          cell.getValue() === "Not implemented"
            ? "bg-destructive/20 text-destructive"
            : cell.getValue() === "Partially implemented"
            ? "bg-[#C65C10]/20 text-[#C65C10]"
            : "bg-green-700/20 text-green-700 "
        }`}
      >
        {cell.getValue() as string}
      </span>
    ),
  },
];
