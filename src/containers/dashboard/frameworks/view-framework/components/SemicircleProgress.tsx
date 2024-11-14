"use client";
import React from "react";
import SemiCircleProgressBar from "react-progressbar-semicircle";

type Props = {
  percentage: number | string;
};

export default function SemicircleProgress({ percentage }: Props) {
  const barColor =
    +percentage >= 80
      ? "rgba(0, 123, 23)"
      : +percentage >= 50 && +percentage < 80
      ? "rgba(255, 179, 0)"
      : +percentage >= 30 && +percentage < 50
      ? "rgba(198, 92, 16)"
      : "rgba(219, 0, 7)";

  const diameter = 255; // Diameter of the semicircle progress bar

  // Convert percentage to radians for positioning on a semicircle (180 degrees)
  //   const angle = (Math.PI * +percentage) / 100; // Angle in radians
  //   const radius = diameter / 2;

  // Calculate the x and y position of the circle at the end of the progress
  //   const circleX = radius + radius * Math.cos(angle - Math.PI);
  //   const circleY = radius + radius * Math.sin(angle - Math.PI);
  return (
    <div className="relative flex flex-col justify-center items-center">
      <SemiCircleProgressBar
        percentage={percentage}
        // stroke={getProgressColor(+progress)}
        stroke={barColor}
        background="#F9F9FB"
        strokeWidth={15}
        width="100%"
        diameter={diameter}
      />
      {/* <div
        className="absolute rounded-full w-6 h-6 border"
        style={{
          backgroundColor: barColor,
          left: `${circleX}px`,
          top: `${circleY}px`,
          transform: "translate(-50%, -50%)",
        }}
      ></div> */}
      <span className="absolute font-bold text-5xl top-[90px]">
        {percentage}%
      </span>
    </div>
  );
}
