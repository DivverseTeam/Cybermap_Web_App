import React from "react";
import SemicircleProgress from "./SemicircleProgress";

type Props = {};

export default function ControlCompletionCard({}: Props) {
  return (
    <div className="relative flex h-[190px] flex-col items-center justify-center gap-0 rounded-sm bg-white p-4 2xl:h-[25vh]">
      <SemicircleProgress percentage={80} />

      <span className="mt-6 [@media(min-width:1400px)]:mt-8 font-semibold text-secondary text-xs">
        120/180 Controls completed
      </span>
    </div>
  );
}
