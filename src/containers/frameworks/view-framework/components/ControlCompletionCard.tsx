import React from "react";
import FrameworkComplianceProgress from "./FrameworkComplianceProgress";
import type { IFrameworkData } from "../../types";

type Props = {
  framework: IFrameworkData;
};

export default function ControlCompletionCard({ framework }: Props) {
  return (
    <div className="relative flex  flex-col items-center justify-center gap-0 rounded-sm bg-white p-4 2xl:h-[25vh]">
      {/* <SemicircleProgress percentage={80} /> */}
      <FrameworkComplianceProgress
        complianceScore={framework.complianceScore}
      />

      <span className="mt-2 [@media(min-width:1400px)]:mt-4 font-semibold text-secondary text-xs">
        {
          framework.complianceScore.find(
            (item) => item.name.toLowerCase() === "passing"
          )?.value
        }
        /{framework.complianceScore.reduce((acc, item) => acc + item.value, 0)}{" "}
        Controls completed
      </span>
    </div>
  );
}
