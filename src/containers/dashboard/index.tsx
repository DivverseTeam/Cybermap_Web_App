"use client";

import { DataTable } from "~/app/_components/table/data-table";
import { Button } from "~/app/_components/ui/button";
import PageTitle from "~/components/PageTitle";
import { DownArrow } from "~/components/svgs/DownArrow";
import ComplianceChart from "./components/ComplianceChart";
import FrameComplianceList from "./components/FrameComplianceList";
// import ProgressChart from "./components/ProgressChart";
import {
  frameworkData,
  frameworkDataColumns,
} from "../frameworks/_lib/constants";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "~/app/_components/ui/table";
import { z } from "zod";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Label,
  Legend,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from "recharts";
import { CircleCheck, CircleX, TriangleAlert } from "lucide-react";
import type { JSX } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { integrations } from "./_lib/contants";
import { columns } from "./components/integrations-table-colums";

// const FrameworkStatus = z.enum([
//   "FULLY_IMPLEMENTED",
//   "NOT_IMPLEMENTED",
//   "PARTIALLY_IMPLEMENTED",
// ]);
// type FrameworkStatus = z.infer<typeof FrameworkStatus>;

// type Framework = {
//   id: string;
//   control: string;
//   mapped: string[];
//   status: FrameworkStatus;

// };

interface RealtimeMonitoringData {
  name: string;
  value: number;
  color: string;
  icon: JSX.Element;
}

const realtimeMonitoringData: RealtimeMonitoringData[] = [
  {
    name: "Passing",
    value: 115,
    color: "#09D886",
    icon: <CircleCheck className="text-[#09D886]" />,
  },
  {
    name: "Failing",
    value: 35,
    color: "#D92D20",
    icon: <CircleX className="text-destructive" />,
  },
  {
    name: "At risk",
    value: 10,
    color: "#FFDC00",
    icon: <TriangleAlert className="text-[#FFDC00]" />,
  },
];

interface EvidenceGatheringData {
  collected: number;
  pending: number;
  notCollected: number;
}
const evidenceGatheringData: EvidenceGatheringData[] = [
  {
    collected: 90000,
    pending: 100000,
    notCollected: 350000,
  },
];

interface CustomPiechartLegendProps {
  payload: {
    name: string;
    color: string;
    value: number;
    icon: JSX.Element;
  }[];
}
const CustomPiechartLegend: React.FC<CustomPiechartLegendProps> = ({
  payload,
}) => {
  return (
    <div className="flex items-center mt-5 text-sm gap-4">
      {payload.map((entry, index) => (
        <div
          key={`legend-item-${index}`}
          className="flex flex-col items-center gap-2"
        >
          {/* Display the text */}
          <span>{entry.name}</span>
          {/* Display the React icon */}
          <div className="flex gap-1 items-center">
            <div>{entry.icon}</div>
            <span className="font-bold ">{entry.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
interface CustomBarchartLegendProps {
  payload: string[];
}
const CustomBarchartLegend: React.FC<CustomBarchartLegendProps> = ({
  payload,
}) => {
  return (
    <div className="w-full mx-auto flex items-center mt-5 text-sm gap-4">
      {payload.map((entry, index) => (
        <div key={`legend-item-${index}`} className="flex items-center gap-2">
          {/* Display the text */}
          {/* Display the React icon */}
          <div className="flex gap-1 items-center">
            <div
              className={`w-3 h-3 rounded-full ${
                entry.toLowerCase() === "collected"
                  ? "bg-[#962DFF]"
                  : entry.toLowerCase() === "pending"
                  ? "bg-[#C893FD]"
                  : "bg-[#F0E5FC]"
              }`}
            ></div>
            <span className="">{entry}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const table = useReactTable({
    data: integrations,
    columns: columns,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    // onSortingChange: (updater) => {
    //   const newSortingState =
    //     typeof updater === "function" ? updater([]) : updater;

    //   const sortBy = newSortingState[0];
    //   router.push(
    //     `/dashboard/evidences?page=1&limit=${itemsPerPage}&search=${search}&sortColumn=${
    //       sortBy?.id
    //     }&sortOrder=${sortBy?.desc ? "desc" : "asc"}`
    //   );
    // },
  });
  return (
    <div className="flex flex-col">
      {/* px-6 */}
      <PageTitle
        title="Dashboard"
        subtitle="Get a overview of your compliance and performance"
      />
      {/* py-6 */}

      <div className="flex flex-col gap-6 py-6">
        {/* General charts */}
        <div className="flex items-center gap-4">
          <div className="h-[400px] min-w-[378px] flex flex-col gap-3 [@media(min-width:1400px)]:gap-4 rounded-[8px] border border-neutral-2 border-solid bg-white p-4 px-2">
            <div className="flex w-full items-center justify-between px-5">
              <p className="text-base font-semibold text-neutral-normal">
                Realtime monitoring
              </p>
              <span className="text-xs text-secondary">
                Last update 2mins ago
              </span>
            </div>
            <div className="flex flex-col gap-1 w-full mx-auto justify-center items-center">
              {/* <ProgressChart /> */}
              <PieChart width={200} height={200}>
                <Pie
                  data={realtimeMonitoringData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  startAngle={240}
                  endAngle={-60} // 80% of a full circle (approximate)
                  cornerRadius={12} // Rounded edges for each segment
                  paddingAngle={-12} // Creates slight overlap by negative padding
                >
                  {realtimeMonitoringData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  {/* First text with larger font size and bold style */}
                  <Label
                    value={`${Math.ceil(
                      (+(
                        realtimeMonitoringData.find(
                          (item) => item.name.toLowerCase() === "passing"
                        )?.value ?? 0
                      ) /
                        +realtimeMonitoringData.reduce(
                          (acc, item) => acc + item.value,
                          0
                        )) *
                        100
                    )}%`}
                    position="center"
                    fontSize={20}
                    fontWeight="bold"
                    fill="#333"
                  />

                  {/* Second text with smaller font size and different color */}
                  <Label
                    value="Passing"
                    position="center"
                    fontSize={13}
                    fill="#8B8D98" // Different color for the second text
                    dy={20} // Position the second text slightly below the first one
                  />
                </Pie>

                <Tooltip />
              </PieChart>

              <CustomPiechartLegend payload={realtimeMonitoringData} />
            </div>
            <Button variant="outline" className="w-60 mx-auto">
              Download report
            </Button>
          </div>
          <div className="h-[400px] w-full flex flex-col gap-3 [@media(min-width:1400px)]:gap-4 rounded-[8px] border border-neutral-2 border-solid bg-white p-4 px-2">
            <div className="flex w-full items-center justify-between px-5">
              <p className="text-base font-semibold text-neutral-normal">
                ISO 27001 Compliance trend
              </p>
              <div className="flex h-8 w-[106px] items-center justify-center gap-2 rounded-sm border border-neutral-5 border-solid bg-white font-medium text-neutral-11 text-sm">
                <span>Annually</span>
                <DownArrow />
              </div>
            </div>
            <ComplianceChart />
          </div>
        </div>

        {/* Preparedness and Readiness */}
        <div className="flex gap-4 w-full justify-between">
          <div className="w-full rounded-[8px] gap-4 p-6 flex flex-col justify-start items-center border border-neutral-2 border-solid bg-white">
            <div className="flex w-full items-start text-base font-semibold text-neutral-normal">
              ISO 27001 Preparedness
            </div>
            <div className="flex items-center justify-center">
              <div className="relative flex flex-col items-center">
                {/* <div className="w-[260px] h-[130px] relative border-t-[50px] border-l-[50px] border-r-[50px]  rounded-t-full border-gray-2">
                  <div className="w-[260px] h-[130px] absolute  border-t-[50px] border-l-[50px] border-r-[50px]  rounded-t-full border-gray-2"></div>
                </div> */}
                <div className="flex gap-20 w-full mx-auto justify-between items-center">
                  {/* <ProgressChart /> */}
                  <PieChart width={200} height={200}>
                    <Pie
                      data={realtimeMonitoringData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      startAngle={240}
                      endAngle={-60} // 80% of a full circle (approximate)
                      cornerRadius={12} // Rounded edges for each segment
                      paddingAngle={-12} // Creates slight overlap by negative padding
                    >
                      {realtimeMonitoringData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      {/* First text with larger font size and bold style */}
                      <Label
                        value={`${Math.ceil(
                          (+(
                            realtimeMonitoringData.find(
                              (item) => item.name.toLowerCase() === "passing"
                            )?.value ?? 0
                          ) /
                            +realtimeMonitoringData.reduce(
                              (acc, item) => acc + item.value,
                              0
                            )) *
                            100
                        )}%`}
                        position="center"
                        fontSize={20}
                        fontWeight="bold"
                        fill="#333"
                      />

                      {/* Second text with smaller font size and different color */}
                      <Label
                        value="Passing"
                        position="center"
                        fontSize={13}
                        fill="#8B8D98" // Different color for the second text
                        dy={20} // Position the second text slightly below the first one
                      />
                    </Pie>

                    <Tooltip />
                  </PieChart>

                  <div className="flex flex-col items-center mt-5 text-sm gap-4">
                    {realtimeMonitoringData.map((entry, index) => (
                      <div
                        key={`legend-item-${index}`}
                        className="flex flex-col items-center gap-1"
                      >
                        {/* Display the text */}
                        <span>{entry.name}</span>
                        {/* Display the React icon */}
                        <div className="flex gap-1 items-center">
                          <div>{entry.icon}</div>
                          <span className="font-bold ">{entry.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* <div className="absolute top-20 flex flex-col items-center gap-[18px]">
                  <div className="flex h-8 w-[137px] items-center justify-center rounded-sm border border-neutral-5 border-solid bg-white font-medium text-neutral-11 text-sm">
                    Download report
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div className="w-full rounded-[8px] gap-4 p-6 flex flex-col justify-start items-center border border-neutral-2 border-solid bg-white">
            <div className="flex w-full items-start text-base font-semibold text-neutral-normal">
              ISO 27001 Audit Readiness
            </div>
            <div className="flex items-center justify-center">
              <div className="relative flex flex-col items-center">
                {/* <div className="w-[260px] h-[130px] relative border-t-[50px] border-l-[50px] border-r-[50px]  rounded-t-full border-gray-2">
                  <div className="w-[260px] h-[130px] absolute  border-t-[50px] border-l-[50px] border-r-[50px]  rounded-t-full border-gray-2"></div>
                </div> */}
                <div className="flex gap-20 w-full mx-auto justify-between items-center">
                  {/* <ProgressChart /> */}
                  <PieChart width={200} height={200}>
                    <Pie
                      data={realtimeMonitoringData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      startAngle={240}
                      endAngle={-60} // 80% of a full circle (approximate)
                      cornerRadius={12} // Rounded edges for each segment
                      paddingAngle={-12} // Creates slight overlap by negative padding
                    >
                      {realtimeMonitoringData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      {/* First text with larger font size and bold style */}
                      <Label
                        value={`${Math.ceil(
                          (+(
                            realtimeMonitoringData.find(
                              (item) => item.name.toLowerCase() === "passing"
                            )?.value ?? 0
                          ) /
                            +realtimeMonitoringData.reduce(
                              (acc, item) => acc + item.value,
                              0
                            )) *
                            100
                        )}%`}
                        position="center"
                        fontSize={20}
                        fontWeight="bold"
                        fill="#333"
                      />

                      {/* Second text with smaller font size and different color */}
                      <Label
                        value="Passing"
                        position="center"
                        fontSize={13}
                        fill="#8B8D98" // Different color for the second text
                        dy={20} // Position the second text slightly below the first one
                      />
                    </Pie>

                    <Tooltip />
                  </PieChart>

                  <div className="flex flex-col items-center mt-5 text-sm gap-4">
                    {realtimeMonitoringData.map((entry, index) => (
                      <div
                        key={`legend-item-${index}`}
                        className="flex flex-col items-center gap-1"
                      >
                        {/* Display the text */}
                        <span>{entry.name}</span>
                        {/* Display the React icon */}
                        <div className="flex gap-1 items-center">
                          <div>{entry.icon}</div>
                          <span className="font-bold ">{entry.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* <div className="absolute top-20 flex flex-col items-center gap-[18px]">
                  <div className="flex h-8 w-[137px] items-center justify-center rounded-sm border border-neutral-5 border-solid bg-white font-medium text-neutral-11 text-sm">
                    Download report
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Integrations table and evidence gathering */}
        <div className="flex gap-4 w-full justify-between ">
          <div className="w-2/3 p-4 bg-white rounded-[8px] min-h-[464px]">
            <div className="flex justify-between w-full items-center  mb-4">
              <p className="font-semibold">Selected Integrations</p>
              <Button variant="outline">View all</Button>
            </div>
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
                {/* {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2">
                  {cell.renderCell()}
                </td>
              ))}
            </tr>
          ))} */}
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
          <div className="flex flex-col gap-5 w-1/3 p-4 bg-white rounded-[8px] min-h-[464px]">
            <p className="font-semibold">Evidence gathering</p>

            <CustomBarchartLegend
              payload={["Collected", "Pending", "Not collected"]}
            />

            <BarChart
              width={300}
              height={340}
              data={evidenceGatheringData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              {/* <Legend /> */}
              <CartesianGrid strokeDasharray="3 3" />
              {/* <XAxis dataKey="name" /> */}
              <YAxis
                tickFormatter={(value) => `${value / 1000}k`} // Format ticks as 'k'
              />
              <Tooltip />
              <Bar dataKey="collected" stackId="a" fill="#962DFF" />
              <Bar dataKey="pending" stackId="a" fill="#C893FD" />
              <Bar
                dataKey="notCollected"
                stackId="a"
                fill="#F0E5FC"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
}
