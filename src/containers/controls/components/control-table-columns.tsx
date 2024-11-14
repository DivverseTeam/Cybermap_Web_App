import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
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
import type { IControl } from "../types";
import type { VariantProps } from "class-variance-authority";
import { Badge, type badgeVariants } from "~/app/_components/ui/badge";

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
  },
  {
    accessorKey: "status",
    header: () => (
      <span className="flex w-[60px] items-center justify-center text-center">
        STATUS
      </span>
    ), // Wrap in span
    // cell: ({ cell }) => (
    //   <span
    //     className={`flex w-max w-[150px] items-center justify-center rounded-xl px-2 py-[2px] font-medium text-xs ${
    //       cell.getValue() === "Not implemented"
    //         ? "bg-destructive/20 text-destructive"
    //         : cell.getValue() === "Partially implemented"
    //         ? "bg-[#C65C10]/20 text-[#C65C10]"
    //         : "bg-green-700/20 text-green-700 "
    //     }`}
    //   >
    //     {cell.getValue() as string}
    //   </span>
    // ),
    cell: ({ cell }) => {
      const status = cell.getValue() as string;
      let badgeVariant: VariantProps<typeof badgeVariants>["variant"];

      if (status.toLowerCase() === "not implemented") {
        badgeVariant = "destructive";
      }

      if (status.toLowerCase() === "fully implemented") {
        badgeVariant = "success";
      }
      if (status.toLowerCase() === "partially implemented") {
        badgeVariant = "warning";
      }
      return (
        // <span
        //   className={`flex w-max items-center justify-center rounded-xl px-2 py-[2px] font-medium text-xs ${
        //     cell.getValue() === "Needs artifact"
        //       ? "bg-destructive/20 text-destructive"
        //       : "bg-green-700/20 text-green-700 "
        //   }`}
        // >{cell.getValue() as string}</span>
        <Badge className="w-max font-semibold" variant={badgeVariant}>
          {status}
        </Badge>
      );
    },
  },
];
