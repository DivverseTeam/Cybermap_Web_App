import type { FunctionComponent } from "react";
import Image from "next/image";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import { toTitleCase } from "~/lib/utils";

interface ProgressCardProps {
  total: number;
  completed: number;
  title: string;
  logo?: string;
  tag: "controls" | "modules";
}

const getBarColor = (percentage: number): string => {
  if (percentage > 75) return `hsl(123, 100%, 30%)`; // Green
  if (percentage > 50) return `hsl(45, 100%, 50%)`; // Yellow
  if (percentage === 50) return `hsl(30, 80%, 40%)`; // Orange
  return `hsl(0, 100%, 40%)`; // Red
};

const ProgressCard: FunctionComponent<ProgressCardProps> = ({
  total,
  completed,
  title,
  logo,
  tag,
}) => {
  const usePercentage = total < 76 || total > 100;
  const percentage = Math.round((completed / total) * 100);
  const radialCircleSize = 20;

  const radialBarData = [{ name: "score", value: percentage }];

  const boxesTotal = usePercentage ? 100 : total;
  const boxesCompleted = usePercentage ? percentage : completed;

  return (
    <div className="flex flex-col gap-3 rounded-[8px] border border-neutral-2 border-solid bg-white p-4 text-xs">
      <div className="mb-2 flex items-center justify-between">
        {logo ? (
          <div className="flex items-center gap-2">
            <div className="relative block h-5 w-5 rounded-[50%]">
              <Image
                src={logo || ""}
                alt="headerImage"
                fill={true}
                priority={true}
                style={{
                  borderRadius: "50%",
                  maxWidth: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </div>
            <p className="text-sm">{title}</p>
          </div>
        ) : (
          <h3 className="font-medium text-base">{title}</h3>
        )}

        <div className="flex items-center gap-1">
          <p>{percentage}%</p>
          <RadialBarChart
            width={radialCircleSize}
            height={radialCircleSize}
            cx={radialCircleSize / 2}
            cy={radialCircleSize / 2}
            innerRadius={8}
            outerRadius={14}
            barSize={2}
            data={radialBarData}
            startAngle={90}
            endAngle={-270}
            className="mx-auto flex items-center justify-center"
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background
              dataKey="value"
              cornerRadius={radialCircleSize / 2}
              fill={getBarColor(percentage)}
            />
          </RadialBarChart>
        </div>
      </div>
      <div className="grid grid-cols-25 gap-1">
        {Array.from({ length: boxesTotal }).map((_, index) => (
          <div
            key={index}
            className={`h-4 w-4 rounded ${
              index < boxesCompleted ? "bg-green-600" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <div className="flex justify-end">
        <p className="text-secondary">
          {completed}/{total} {toTitleCase(tag)} completed
        </p>
      </div>
    </div>
  );
};

export default ProgressCard;
