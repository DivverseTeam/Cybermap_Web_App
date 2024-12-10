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
import { useEffect, useState } from "react";
import type { FrameworkType } from "./types";

export default function DashboardPage() {
  const [frameworks] = api.frameworks.getWithCompletion.useSuspenseQuery();

  const [{ all }] = api.integrations.get.useSuspenseQuery();

  console.log(all);

  const [averageReadinessScore, setAverageReadinessScore] = useState<number>(0);

  useEffect(() => {
    const getAverageReadinessScore = (frameworks: FrameworkType[]) => {
      const totals = frameworks.reduce(
        (acc, framework) => {
          acc.completed += framework.preparedness.completed;
          acc.total += framework.preparedness.total;
          return acc;
        },
        { completed: 0, total: 0 }
      );

      return totals.total > 0 ? (totals.completed / totals.total) * 100 : 0;
    };

    const averageCompletionRate = getAverageReadinessScore(frameworks);

    setAverageReadinessScore(averageCompletionRate);
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
        <div className="flex gap-6 w-full justify-between">
          {/* Readiness score */}
          <div className="flex flex-col gap-3 [@media(min-width:1400px)]:gap-4 w-[380px] min-h-[220px] max-h-[300px] 2xl:max-h-[350px] rounded-[8px] ">
            <p className="w-full text-nowrap">Audit readiness</p>
            <div className="bg-gray-100 p-3 h-full rounded-xl border border-neutral-2 border-solid">
              <div className="flex h-full rounded-lg bg-white shadow-md justify-between items-center">
                <ReadinessScoreIndicator score={averageReadinessScore} />
              </div>
            </div>
          </div>

          {/* Framework status */}
          <div className="flex flex-col gap-3 [@media(min-width:1400px)]:gap-4 w-full min-h-[220px] rounded-[8px] ">
            <p className="w-full text-nowrap">Framework status</p>
            <div className="w-full rounded-xl gap-4 p-3  border border-neutral-2 border-solid bg-gray-100">
              <div
                className={`grid items-center gap-3 rounded-[8px] ${
                  frameworks?.length === 1 ? "grid-cols-1" : "grid-cols-2"
                }`}
              >
                {frameworks?.map((framework, idx) => {
                  const {
                    logo,
                    name,
                    // complianceScore: { passing, failing, risk },
                    // readiness,
                    preparedness,
                  } = framework;

                  return (
                    <FrameworkStatusCard
                      key={idx}
                      name={name}
                      logo={logo}
                      preparedness={preparedness}
                      readiness={preparedness}
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
