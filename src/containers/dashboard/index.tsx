"use client";

import { DataTable } from "~/app/_components/table/data-table";
import { Button } from "~/app/_components/ui/button";
import PageTitle from "~/components/PageTitle";
import { DownArrow } from "~/components/svgs/DownArrow";
import ComplianceChart from "./components/ComplianceChart";
import FrameComplianceList from "./components/FrameComplianceList";
import ProgressChart from "./components/ProgressChart";
import { frameworkData, frameworkDataColumns } from "./constants";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "~/app/_components/ui/table";
import { z } from "zod";
import { PieChart, Pie, Cell, Tooltip, Label, Legend } from "recharts";
import { CircleCheck, CircleX, TriangleAlert } from "lucide-react";
import type { JSX } from "react";

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

export default function DashboardPage() {
  return (
    <div className="flex flex-col pb-6">
      {/* px-6 */}
      <PageTitle
        title="Dashboard"
        subtitle="Get a overview of your compliance and performance"
      />
      {/* py-6 */}

      <div className="flex flex-col gap-6 py-6">
        {/* General charts */}
        <div className="flex items-center gap-6">
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
                  innerRadius={70}
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
          <div className="flex flex-col justify-center items-center h-[400px] w-full rounded-[8px] border border-neutral-2 border-solid bg-white">
            <div className="flex h-[72px] w-full items-center justify-between px-5">
              <p className="text-base text-neutral-normal">
                Compliance over time
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
                      innerRadius={70}
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
                      innerRadius={70}
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

        {/* Integrations and evidences */}

        <div className="flex items-center gap-6">
          <div className="custom-scroll h-[552px] max-h-[552px] w-full overflow-scroll rounded-[8px] bg-white">
            <div className="flex h-[72px] w-full items-center justify-between px-5">
              <p className="text-base text-neutral-normal">Control status</p>
              <div className="flex h-8 w-[76px] items-center justify-center rounded-sm border border-neutral-5 border-solid bg-white font-medium text-neutral-11 text-sm">
                View all
              </div>
            </div>
            <div>
              <DataTable columns={frameworkDataColumns} data={frameworkData} />
            </div>
          </div>
          <div className="custom-scroll h-[552px] max-h-[552px] min-w-[378px] rounded-[8px] bg-white">
            <div className="flex h-[72px] w-full items-center justify-between px-5">
              <p className="text-base text-neutral-normal">
                Framework compliance
              </p>
              <div className="flex h-8 w-[76px] items-center justify-center rounded-sm border border-neutral-5 border-solid bg-white font-medium text-neutral-11 text-sm">
                View all
              </div>
            </div>
            <div className="flex flex-col gap-4 p-4">
              <FrameComplianceList />
              <FrameComplianceList />
              <FrameComplianceList />
              <FrameComplianceList />
              <FrameComplianceList />
              {/* <FrameComplianceList /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
