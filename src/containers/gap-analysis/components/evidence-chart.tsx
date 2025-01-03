'use client';

import * as React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  date: string;
  gathered: number;
  notGathered: number;
}

interface EvidenceChartProps {
  data?: DataPoint[];
}

const data = [
  { date: 'Mar 12', gathered: 5, notGathered: 95 },
  { date: 'Mar 16', gathered: 10, notGathered: 90 },
  { date: 'Mar 20', gathered: 15, notGathered: 85 },
  { date: 'Mar 24', gathered: 25, notGathered: 75 },
  { date: 'Mar 28', gathered: 55, notGathered: 45 },
  { date: 'Apr 2', gathered: 85, notGathered: 15 },
  { date: 'Apr 6', gathered: 95, notGathered: 5 },
  { date: 'Apr 10', gathered: 100, notGathered: 0 },
];
/* {
  data = defaultData,
}: EvidenceChartProps */

export default function EvidenceChart() {
  return (
    <div className="rounded-lg border bg-white p-6 pb-8 w-full max-w-3xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium">Evidence</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-[#00749E]" />
              <span className="text-sm text-black">Gathered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-[#60B3D7]" />
              <span className="text-sm text-black">Not Gathered</span>
            </div>
          </div>
        </div>
        <div className="flex h-[200px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey="date" />
              <YAxis
                dataKey="gathered"
                tickFormatter={(value) => `${Math.round(value * 1)}%`}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#666', fontSize: 12 }}
                ticks={[0, 50, 100]}
              />
              <Tooltip />
              <Bar dataKey="gathered" stackId="a" fill="#00749E" />
              <Bar dataKey="notGathered" stackId="a" fill="#60B3D7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
