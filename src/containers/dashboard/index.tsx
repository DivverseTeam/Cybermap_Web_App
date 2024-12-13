"use client";

import PageTitle from "~/components/PageTitle";

import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "~/app/_components/ui/table";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { columns } from "./components/integrations-table-colums";
import ReadinessScoreIndicator from "./components/readiness-score-indicator";
import EvidenceGatheringChart from "./components/evidence-gathering-chart";
import { api } from "~/trpc/react";
import FrameworkStatusCard from "./components/framework-status-card";
import ComplianceChart from "./components/compliance-chart";
import { useMemo } from "react";

export default function DashboardPage() {
  const [frameworks] = api.frameworks.getWithCompletion.useSuspenseQuery();

  const [{ all }] = api.integrations.get.useSuspenseQuery();

  const averageReadinessScore = useMemo(() => {
    const totals = frameworks.reduce(
      (acc, framework) => {
        acc.completed += framework.readiness.completed;
        acc.total += framework.readiness.total;
        return acc;
      },
      { completed: 0, total: 0 }
    );

    return totals.total > 0 ? (totals.completed / totals.total) * 100 : 0;
  }, [frameworks]);

  const tableData = all || [];
  const table = useReactTable({
    data: tableData,
    columns: columns,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-5">
      {/* px-6 */}
      <PageTitle
        title="Dashboard"
        subtitle="Get a overview of your compliance and performance"
      />
      {/* py-6 */}

      <div className="flex flex-col gap-10 py-6">
        {/* Preparedness and Readiness */}
        <div className="flex w-full justify-between gap-6">
          {/* Readiness score */}
          <div className="flex max-h-[300px] min-h-[220px] w-[380px] flex-col gap-3 rounded-[8px] 2xl:max-h-[350px] [@media(min-width:1400px)]:gap-4 ">
            <p className="w-full text-nowrap">Audit readiness</p>
            <div className="bg-gray-100 p-3 h-full rounded-xl border border-neutral-2 border-solid">
              <div className="flex h-full rounded-lg bg-white shadow-md justify-between items-center">
                <ReadinessScoreIndicator score={averageReadinessScore} />
              </div>
            </div>
          </div>

          {/* Framework status */}
          <div className="flex min-h-[220px] w-full flex-col gap-3 rounded-[8px] [@media(min-width:1400px)]:gap-4 ">
            <p className="w-full text-nowrap">Framework status</p>
            <div className="w-full gap-4 rounded-xl border border-neutral-2 border-solid bg-gray-100 p-3">
              <div
                className={`grid items-center gap-3 rounded-[8px] ${
                  frameworks?.length === 1 ? "grid-cols-1" : "grid-cols-2"
                }`}
              >
                {frameworks?.map((framework, idx) => {
                  const { logo, name, preparedness,readiness } = framework;

                  return (
                    <FrameworkStatusCard
                      key={idx}
                      name={name}
                      logo={logo}
                      preparedness={preparedness}
                      readiness={readiness}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* General charts */}
        <div className="flex items-center gap-6">
          {/* Framework compliance chart */}
          <div className="h-[560px] w-full">
            <ComplianceChart />
          </div>
          <div className="h-[560px] min-w-[400px]">
            {/* Evidence gathering */}
            <EvidenceGatheringChart />
          </div>
        </div>

        {/* Integrations table and evidence gathering */}
        <div className="flex flex-col">
          <p className="mb-4">Selected integrations</p>
          <div className="bg-gray-100 p-3 rounded-xl border border-neutral-2 border-solid">
            <div className="w-full p-4 bg-white rounded-[8px] h-max shadow-md">
              <Table className=" ">
                <TableHeader className="bg-muted text-[#40566D] text-xs [@media(min-width:1400px)]:text-sm">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          <button className="rounded-none">
                            {header.isPlaceholder
                              ? null
                              : typeof header.column.columnDef.header ===
                                "function"
                              ? header.column.columnDef.header(
                                  header.getContext()
                                ) // Call the function to get the rendered header
                              : header.column.columnDef.header}
                          </button>
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="bg-white">
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
