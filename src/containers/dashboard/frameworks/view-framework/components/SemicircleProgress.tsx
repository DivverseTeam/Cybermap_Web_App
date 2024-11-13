"use client";
import React from "react";
import { useEffect, useState } from "react";
import SemiCircleProgressBar from "react-progressbar-semicircle";

type Props = {
  percentage: number | string;
};

export default function SemicircleProgress({ percentage }: Props) {
  // const [offset, setOffset] = useState(0);
  // const [endPosition, setEndPosition] = useState({ x: 0, y: 0 });

  // useEffect(() => {
  // 	const progressOffset = ((100 - +percentage) / 100) * (Math.PI * 50);
  // 	setOffset(progressOffset);

  // 	// Calculate the angle based on the percentage
  // 	const angle = (+percentage / 100) * Math.PI; // Angle in radians

  // 	// Calculate x, y positions for the endpoint of the arc (circle at the end of the progress)
  // 	const radius = 40; // Radius of the arc
  // 	const centerX = 61; // Center x of the semicircle
  // 	const centerY = 3; // Center y of the semicircle
  // 	const x = centerX + radius * Math.cos(Math.PI - angle); // Adjusting to get the correct arc direction
  // 	const y = centerY + radius * Math.sin(Math.PI - angle);

  // 	setEndPosition({ x, y });
  // }, [percentage]);

  //   return (
  //     <div className="relative scale-125 2xl:h-[150px] 2xl:scale-150">
  //       <svg
  //         width="187.83px"
  //         height="140px"
  //         viewBox="0 0 100 80"
  //         fill="none"
  //         xmlns="http://www.w3.org/2000/svg"
  //       >
  //         <path
  //           d="M10 50a40 40 0 0 1 80 0"
  //           stroke="#e5e7eb" // Gray color for background
  //           strokeWidth="6"
  //           fill="none"
  //         />
  //         <path
  //           d="M10 50a40 40 0 0 1 80 0"
  //           stroke="#3b82f6" // Blue color for progress
  //           strokeWidth="6"
  //           strokeDasharray={Math.PI * 50}
  //           strokeDashoffset={offset}
  //           fill="none"
  //         />
  //         <circle
  //           cx={endPosition.x}
  //           cy={endPosition.y}
  //           r="5"
  //           stroke="#ffffff" // Gray background color
  //           strokeWidth="1"
  //           fill="#3b82f6"
  //         />
  //       </svg>
  //       <div className="absolute inset-0 top-4 right-0 flex items-center justify-center font-bold text-2xl">
  //         {percentage}%
  //       </div>
  //     </div>
  //   );

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
