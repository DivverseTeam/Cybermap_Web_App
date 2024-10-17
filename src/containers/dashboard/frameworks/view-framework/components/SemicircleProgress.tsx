"use client";
import React from "react";
import { useState, useEffect } from "react";

type Props = {
  percentage: number | string;
};

export default function SemicircleProgress({ percentage }: Props) {
  const [offset, setOffset] = useState(0);
  const [endPosition, setEndPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const progressOffset = ((100 - +percentage) / 100) * (Math.PI * 50);
    setOffset(progressOffset);

    // Calculate the angle based on the percentage
    const angle = (+percentage / 100) * Math.PI; // Angle in radians

    // Calculate x, y positions for the endpoint of the arc (circle at the end of the progress)
    const radius = 40; // Radius of the arc
    const centerX = 61; // Center x of the semicircle
    const centerY = 2; // Center y of the semicircle
    const x = centerX + radius * Math.cos(Math.PI - angle); // Adjusting to get the correct arc direction
    const y = centerY + radius * Math.sin(Math.PI - angle);

    setEndPosition({ x, y });
  }, [percentage]);

  return (
    <div className="relative">
      <svg
        width="187.83px"
        height="140px"
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 50a40 40 0 0 1 80 0"
          stroke="#e5e7eb" // Gray color for background
          strokeWidth="7"
          fill="none"
        />
        <path
          d="M10 50a40 40 0 0 1 80 0"
          stroke="#3b82f6" // Blue color for progress
          strokeWidth="7"
          strokeDasharray={Math.PI * 50}
          strokeDashoffset={offset}
          fill="none"
        />
        <circle
          cx={endPosition.x}
          cy={endPosition.y}
          r="6"
          stroke="#ffffff" // Gray background color
          strokeWidth="1"
          fill="#3b82f6"
        />
      </svg>
      <div className="absolute inset-0 top-4 right-0 flex items-center justify-center text-2xl font-bold">
        {percentage}%
      </div>
    </div>
  );
}
