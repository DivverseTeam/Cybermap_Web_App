import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useEffect, useState, useTransition } from "react";

import { CircleCheck, TriangleAlert } from "lucide-react";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
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
import type { IntegrationType } from "../types";
import Image from "next/image";
import type { VariantProps } from "class-variance-authority";
import { Badge, type badgeVariants } from "~/app/_components/ui/badge";
import { ViewDashboardIntegrationSheet } from "./view-dashboard-integration-sheet";

// const columnHelper = createColumnHelper();

export const columns: ColumnDef<IntegrationType>[] = [
  {
    accessorFn: (row) => ({
      name: row.name,
      icon: row.icon,
    }),
    id: "name",
    header: () => <span>INTEGRATION</span>,
    cell: ({ row }) => {
      const { name, icon } = row.getValue("name") as {
        name: string;
        icon: string;
      };
      return (
        <div className="flex items-center gap-2">
          <div className="flex h-2 w-2 rounded-sm border p-2 ">
            <Image src={icon} alt="integration_icon" width={10} height={10} />
          </div>

          <div className="flex flex-col">
            <span className="font-semibold">{name}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: () => <span>CATEGORY</span>, // Wrap in span
    cell: ({ row }) => {
      const category = row.getValue("category") as string[];
      return (
        <span className="rounded-xl bg-[#0F78AD]/20 px-2 py-[2px] font-semibold text-[#0F78AD] text-xs whitespace-nowrap text-center">
          {category}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => (
      <span className="flex w-[110px] items-center justify-center text-center">
        Status
      </span>
    ), // Wrap in span
    cell: ({ cell }) => {
      const status = cell.getValue() as string;
      let badgeVariant: VariantProps<typeof badgeVariants>["variant"];

      if (status.toLowerCase() === "disconnected") {
        badgeVariant = "destructive";
      }

      if (status.toLowerCase() === "connected") {
        badgeVariant = "success";
      }
      if (status.toLowerCase() === "partially connected") {
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
  {
    accessorKey: "actions",
    header: () => <span></span>, // Wrap in span
    cell: function Cell({ row }) {
      const [showViewIntegrationSheet, setShowViewIntegrationSheet] =
        useState(false);

      // console.log(row.original);

      return (
        <ViewDashboardIntegrationSheet
          open={showViewIntegrationSheet}
          onOpenChange={setShowViewIntegrationSheet}
          integration={row.original as unknown as IntegrationType}
        />
      );
    },
  },
];
