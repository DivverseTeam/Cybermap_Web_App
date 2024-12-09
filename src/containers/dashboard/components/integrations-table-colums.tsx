import type { ColumnDef } from "@tanstack/react-table";
import {  useState, } from "react";

import type { IntegrationType } from "../types";
import Image from "next/image";
import { Badge } from "~/app/_components/ui/badge";
import { ViewDashboardIntegrationSheet } from "./view-dashboard-integration-sheet";

// const columnHelper = createColumnHelper();

export const columns: ColumnDef<IntegrationType>[] = [
  {
    accessorFn: (row) => ({
      name: row.name,
      image: row.image,
    }),
    id: "name",
    header: () => <span>INTEGRATION</span>,
    cell: ({ row }) => {
      const { name, image } = row.getValue("name") as {
        name: string;
        image: string;
      };
      return (
        <div className="flex items-center gap-2">
          <Image
            src={image}
            alt={`${name} logo`}
            width={25}
            height={25}
            className="border rounded-sm p-1"
          />
          <div className="flex flex-col">
            <span className="font-semibold">{name}</span>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "category",
    header: () => <span>CATEGORY</span>,
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
    accessorKey: "isConnected",
    header: () => (
      <span className="flex w-[110px] items-center justify-center text-center">
        Status
      </span>
    ), 
    cell: ({ cell }) => {
      const isConnected = cell.getValue() as boolean;

      return (
        <Badge
          className="w-max font-semibold"
          variant={`${isConnected ? "success" : "destructive"}`}
        >
          {isConnected ? "Connected" : "Disconnected"}
        </Badge>
      );
    },
  },

  {
    accessorKey: "actions",
    header: () => <span></span>, 
    cell: function Cell({ row }) {
      const [showViewIntegrationSheet, setShowViewIntegrationSheet] =
        useState(false);


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
