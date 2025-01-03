'use client';

import { PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent } from '~/app/_components/ui/card';

const data = [
  { name: 'Passing', value: 100, color: '#30A46C' },
  { name: 'Failing', value: 20, color: '#DD4425' },
  { name: 'Pending', value: 10, color: '#EF5F00' },
];

const total = data.reduce((sum, item) => sum + item.value, 0);
const passingPercentage = data[0]
  ? Math.round((data[0].value / total) * 100)
  : 0;

export default function ControlsChart() {
  return (
    <Card className="w-[400px]">
      <CardContent className="p-6">
        <div className="space-y-6">
          <h3 className="text-base font-medium text-[#202020]">
            {passingPercentage}% of Controls Passed
          </h3>

          <div className="flex items-center justify-between w-full  h-full">
            {/* Legend */}
            <div className="flex items-start gap-5 justify-around flex-col h-full ">
              {data.map((entry) => (
                <div className="flex items-center space-x-2" key={entry.name}>
                  <div
                    className="w-4 h-4"
                    style={{ backgroundColor: entry.color }}
                  />

                  <span className="text-gray-700 font-medium">
                    {' '}
                    {entry.name}
                  </span>

                  <div className="flex-1 h-[1px] w-10 bg-red-800"></div>

                  <span className="text-gray-700 font-medium">
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="relative">
              <PieChart width={180} height={180}>
                <Pie
                  data={data}
                  cx={90}
                  cy={90}
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-2xl font-semibold">{total}</div>
                <div className="text-gray-500 text-sm">Controls</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
