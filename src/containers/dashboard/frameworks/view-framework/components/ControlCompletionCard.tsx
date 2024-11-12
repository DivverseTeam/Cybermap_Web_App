import React from "react";
import SemicircleProgress from "./SemicircleProgress";

type Props = {};

export default function ControlCompletionCard({}: Props) {
  return (
    <div className="flex h-[170px] flex-col items-center justify-center gap-0 rounded-sm bg-white p-4 2xl:h-[25vh]">
      <SemicircleProgress percentage={72} />
      <span className="mt-[-30px] font-semibold text-secondary text-xs">
        120/180 Controls completed
      </span>
    </div>
  );
}
