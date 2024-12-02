"use client";

import SemiCircleProgressBar from "react-progressbar-semicircle";
import { getProgressColor } from "../_lib/constants";
import { Cell, Label, Pie, PieChart, Tooltip } from "recharts";
import { toTitleCase } from "~/lib/utils";

interface FrameworkComplianceProgressProps {
  complianceScore: {
    passing: number;
    failing: number;
    risk: number;
  };
}

const KeyProgressColorMap: Record<string, string> = {
  passing: "#09D886",
  failing: "#D92D20",
  risk: "#FFDC00",
};

export default function FrameworkComplianceProgress({
  complianceScore,
}: FrameworkComplianceProgressProps) {
  const chartData = Object.entries(complianceScore).map(([key, value]) => ({
    name: toTitleCase(key),
    value: value,
    color: KeyProgressColorMap[key],
  }));

  return (
    <PieChart width={180} height={180}>
      <Pie
        data={chartData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={72}
        outerRadius={90}
        startAngle={240}
        endAngle={-65} // 80% of a full circle (approximate)
        cornerRadius={10} // Rounded edges for each segment
        paddingAngle={-10} // Creates slight overlap by negative padding
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
        {/* First text with larger font size and bold style */}
        <Label
          value={`${Math.ceil(
            (+(
              chartData.find((item) => item.name.toLowerCase() === "passing")
                ?.value ?? 0
            ) /
              +chartData.reduce((acc, item) => acc + item.value, 0)) *
              100,
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
  );
}
