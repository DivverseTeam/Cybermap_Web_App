"use client";
// import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "~/trpc/react";

const data = [
  { month: "Jan", compliance: 62 },
  { month: "Feb", compliance: 81 },
  { month: "Mar", compliance: 56 },
  { month: "April", compliance: 65 },
  { month: "May", compliance: 99 },
  { month: "June", compliance: 82 },
  { month: "July", compliance: 95 },
  { month: "Aug", compliance: 84 },
  { month: "Sept", compliance: 70 },
  { month: "Oct", compliance: 60 },
  { month: "Nov", compliance: 90 },
  { month: "Dec", compliance: 85 },
];

interface CustomBarchartLegendLegendProps {
  framework: string;
}

const CustomBarchartLegend: React.FC<CustomBarchartLegendLegendProps> = ({
  framework,
}) => {
  return (
    <div className="w-full mx-auto flex items-center mt-5 text-sm gap-4">
      <div className="flex gap-2 items-center">
        <div
          className={`w-4 h-4 rounded-[2px] ${
            framework.replace(/\s/g, "").toUpperCase() === "ISO27001"
              ? "bg-[#F26F10]"
              : framework.replace(/\s/g, "").toUpperCase() === "SOC2"
              ? "bg-primary"
              : "bg-[#1b8241]"
          }`}
        ></div>
        <span className="text-nowrap text-black">{framework}</span>
      </div>
    </div>
  );
};

export default function ComplianceChart() {
  const [frameworks] = api.frameworks.getWithCompletion.useSuspenseQuery();

  return (
    <div className="h-full w-full flex flex-col gap-3 [@media(min-width:1400px)]:gap-4 ">
      <p className="">Compliance trend</p>

      <div className="rounded-[8px] p-3 bg-gray-100 border border-neutral-2 border-solid">
        <div className="flex flex-col justify-center mx-auto h-[500px] p-5 bg-white shadow-md text-[#9c9a98] gap-4">
          {frameworks?.map((framework, idx) => (
            <CustomBarchartLegend key={idx} framework={framework.name} />
          ))}
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: -30,
                bottom: 0,
              }}
            >
              <XAxis
                dataKey="month"
                tick={{
                  fontSize: 10.18,
                  fontWeight: 400,
                  fill: "#9c9a98",
                  fontFamily: "Inter",
                }}
              />
              <CartesianGrid vertical={false} />
              <YAxis
                orientation="left"
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
                tick={{
                  fontSize: 11.63,
                  fontWeight: 400,
                  fill: "#9c9a98",
                  fontFamily: "Inter",
                }}
              />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="compliance"
                stroke="#b5803a"
                strokeWidth={3}
                fill="url(#colorPv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
