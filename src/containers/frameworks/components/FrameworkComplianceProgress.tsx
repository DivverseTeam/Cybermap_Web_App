import SemiCircleProgressBar from "react-progressbar-semicircle";
import { getProgressColor } from "../_lib/constants";
import { Cell, Label, Pie, PieChart, Tooltip } from "recharts";
import type { FrameworkComplianceScore } from "../types";

interface FrameworkComplianceProgressProps {
  complianceScore: FrameworkComplianceScore[];
  // icon: JSX.Element;
}

export default function FrameworkComplianceProgress({
  complianceScore,
}: FrameworkComplianceProgressProps) {
  return (
    <PieChart width={180} height={180}>
      <Pie
        data={complianceScore}
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
        {complianceScore.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
        {/* First text with larger font size and bold style */}
        <Label
          value={`${Math.ceil(
            (+(
              complianceScore.find(
                (item) => item.name.toLowerCase() === "passing"
              )?.value ?? 0
            ) /
              +complianceScore.reduce((acc, item) => acc + item.value, 0)) *
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
  );
}
