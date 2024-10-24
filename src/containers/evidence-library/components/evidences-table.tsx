"use client";
"use memo";

import * as React from "react";
import { evidences, type Evidence } from "../db/schema";
import { type DataTableFilterField } from "~/types";

import { useDataTable } from "~/hooks/use-data-table";
import { DataTableAdvancedToolbar } from "~/components/data-table/advanced/data-table-advanced-toolbar";
import { DataTable } from "~/components/data-table/data-table";
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar";

import { type getEvidences } from "../_lib/queries";
// import { getPriorityIcon, getStatusIcon } from "../_lib/utils";
import { getColumns } from "./evidences-table-columns";
// import { EvidencesTableFloatingBar } from "./evidences-table-floating-bar";
import { useEvidencesTable } from "./evidences-table-provider";
import { EvidencesTableToolbarActions } from "./evidences-table-toolbar-actions";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

interface EvidencesTableProps {
  evidencesPromise: ReturnType<typeof getEvidences>;
}

export function EvidencesTable({ evidencesPromise }: EvidencesTableProps) {
  // Feature flags for showcasing some additional features. Feel free to remove them.
  const { featureFlags } = useEvidencesTable();

  const { data, pageCount, totalRows } = React.use(evidencesPromise);
  console.log("data-", data);

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), []);

  /**
   * This component can render either a faceted filter or a search filter based on the `options` prop.
   *
   * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
   *
   * Each `option` object has the following properties:
   * @prop {string} label - The label for the filter option.
   * @prop {string} value - The value for the filter option.
   * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
   * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
   */
  const filterFields: DataTableFilterField<Evidence>[] = [
    {
      label: "File name",
      value: "name",
      placeholder: "Search for a file...",
      icon: <MagnifyingGlassIcon />, // Add the search icon here
    },
    {
      label: "Status",
      value: "status",
      options: evidences.status.enumValues.map((status: any) => ({
        label: status[0]?.toUpperCase() + status.slice(1),
        value: status,
        // icon: getStatusIcon(status),
        withCount: true,
      })),
    },
    // {
    //   label: "Priority",
    //   value: "priority",
    //   options: tasks.priority.enumValues.map((priority) => ({
    //     label: priority[0]?.toUpperCase() + priority.slice(1),
    //     value: priority,
    //     icon: getPriorityIcon(priority),
    //     withCount: true,
    //   })),
    // },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    /* optional props */
    filterFields,
    enableAdvancedFilter: featureFlags.includes("advancedFilter"),
    state: {
      sorting: [{ id: "createdAt", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { right: ["actions"] },
    },

    /* */
  });

  return (
    <DataTable
      totalRows={totalRows}
      table={table}
      // floatingBar={
      //   featureFlags.includes("floatingBar") ? (
      //     <TasksTableFloatingBar table={table} />
      //   ) : null
      // }
    >
      {featureFlags.includes("advancedFilter") ? (
        <DataTableAdvancedToolbar table={table} filterFields={filterFields}>
          <EvidencesTableToolbarActions table={table} />
        </DataTableAdvancedToolbar>
      ) : (
        <DataTableToolbar table={table} filterFields={filterFields}>
          <EvidencesTableToolbarActions table={table} />
        </DataTableToolbar>
      )}
    </DataTable>
  );
}
