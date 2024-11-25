import type { ColumnDef } from "@tanstack/react-table";

import { titleCaseStatus } from "~/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { Badge, type badgeVariants } from "~/app/_components/ui/badge";
import type { ControlStatus, OrganisationControl } from "~/lib/types/controls";

// interface RowData {
//   name: string;
//   mappedControls: string[];
//   status: string;
// }
// const columnHelper = createColumnHelper<RowData>();

export const columns: ColumnDef<OrganisationControl>[] = [
  {
    accessorKey: "name",
    header: () => <span>CONTROL</span>, // Wrap in span
    cell: ({ cell }) => <span className="">{cell.getValue() as string}</span>,
  },
  {
    accessorKey: "mapped",
    header: () => <span>MAPPED</span>, // Wrap in span
    cell: ({ row }) => {
      const mappedControls = row.getValue("mapped") as string[];
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

    cell: ({ cell }) => {
      const status = cell.getValue() as ControlStatus;
      let badgeVariant: VariantProps<typeof badgeVariants>["variant"];

      if (status === "NOT_IMPLEMENTED") {
        badgeVariant = "destructive";
      }

      if (status === "FULLY_IMPLEMENTED") {
        badgeVariant = "success";
      }
      if (status === "PARTIALLY_IMPLEMENTED") {
        badgeVariant = "warning";
      }

      return (
        <Badge className="w-max font-semibold" variant={badgeVariant}>
          {titleCaseStatus(status)}
        </Badge>
      );
    },
  },
];
