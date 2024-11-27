"use client";
// import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "JAN", compliance: 62 },
  { month: "FEB", compliance: 81 },
  { month: "MAR", compliance: 56 },
  { month: "APR", compliance: 65 },
  { month: "MAY", compliance: 99 },
  { month: "JUN", compliance: 82 },
  { month: "JUL", compliance: 95 },
  { month: "AUG", compliance: 84 },
  { month: "SEP", compliance: 70 },
  { month: "OCT", compliance: 60 },
  { month: "NOV", compliance: 90 },
  { month: "DEC", compliance: 85 },
];

export default function ComplianceChart() {
  return (
    <div className="h-[330px] w-full px-5">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            // right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#962DFF" stopOpacity={1} />
              <stop offset="48.25%" stopColor="#F1CAFF" stopOpacity={1} />
              <stop offset="103.37%" stopColor="#FFFFFF" stopOpacity={1} />
            </linearGradient>

            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#962DFF" stopOpacity={1} />
              <stop offset="48.25%" stopColor="#F1CAFF" stopOpacity={1} />
              <stop offset="103.37%" stopColor="#FFFFFF" stopOpacity={1} />
            </linearGradient>
          </defs>
          {/* <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#74E0AD" stopOpacity={1} />
              <stop offset="48.25%" stopColor="#B6FFD3" stopOpacity={1} />
              <stop offset="103.37%" stopColor="#FFFFFF" stopOpacity={1} />
            </linearGradient>

            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#74E0AD" stopOpacity={1} />
              <stop offset="48.25%" stopColor="#B6FFD3" stopOpacity={1} />
              <stop offset="103.37%" stopColor="#FFFFFF" stopOpacity={1} />
            </linearGradient>
          </defs> */}
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tick={{
              fontSize: 10.18,
              fontWeight: 400,
              fill: "#B9BBC6",
              fontFamily: "Inter",
            }}
          />
          <YAxis
            orientation="right"
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tick={{
              fontSize: 11.63,
              fontWeight: 400,
              fill: "#B9BBC6",
              fontFamily: "Inter",
            }}
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="compliance"
            stroke="rgba(150, 45, 255, 1)"
            // width={100}
            fill="url(#colorPv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
