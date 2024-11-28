import React from "react";
import type { IFramework } from "../types";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import Link from "next/link";

type Props = {
  framework: IFramework;
};

export default function FrameworkCard({ framework }: Props) {
  const { logo, name, controlsCompletion } = framework;

  const radialCircleSize = 20;

  const radialBarData = [
    { name: "score", value: controlsCompletion.completedControls },
  ];

  // Set colors based on score value
  const barColor =
    controlsCompletion.completedControls > 75
      ? "rgba(0, 123, 23)"
      : controlsCompletion.completedControls > 50 &&
        controlsCompletion.completedControls <= 75
      ? "rgba(255, 179, 0)"
      : controlsCompletion.completedControls === 50
      ? "rgba(198, 92, 16)"
      : "rgba(219, 0, 7)";

  // Create an array with `true` for completed steps and `false` for remaining steps
  const controlBoxes = Array.from(
    { length: controlsCompletion.totalControls },
    (_, i) => i < controlsCompletion.completedControls
  );

  return (
    <Link href={`/compliance-guide/${name}`}>
      <div className="flex flex-col gap-3 rounded-[8px] border border-neutral-2 border-solid bg-white px-3 py-4 text-xs">
        <div className="flex justify-between px-2">
          <div className="flex items-center gap-2">
            <p className="rounded-full bg-secondary w-5 h-5">{logo}</p>
            <p className="text-sm">{name}</p>
          </div>
          <div className="flex items-center gap-1">
            <p>
              {Math.ceil(
                (controlsCompletion.completedControls /
                  controlsCompletion.totalControls) *
                  100
              )}
              %
            </p>
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
                fill={barColor}
              />
            </RadialBarChart>
          </div>
        </div>
        <div className="grid grid-cols-25 gap-1">
          {controlBoxes.map((isCompleted, index) => (
            <div
              key={index}
              className={`h-4 w-4 rounded ${
                isCompleted ? "bg-green-600" : "bg-gray-200"
              }`}
            ></div>
          ))}
        </div>
        <div className="flex justify-end">
          <p className="text-secondary">
            {controlsCompletion.completedControls}/
            {controlsCompletion.totalControls} Controls completed
          </p>
        </div>
      </div>
    </Link>
  );
}
