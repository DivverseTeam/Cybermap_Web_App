"use client";

import type { VariantProps } from "class-variance-authority";
import { useEffect, useState } from "react";
import {
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
} from "recharts";
import { Badge, type badgeVariants } from "~/app/_components/ui/badge";
import Needle from "~/components/svgs/needle";
type Props = {
  score: number;
};

export default function ReadinessScoreIndicator({ score }: Props) {
  // Ensure the score is within bounds (0–100)
  const clampedScore = Math.max(0, Math.min(100, score));

  const [scoreRank, setScoreRank] = useState<string>("");

  useEffect(() => {
    if (score > 75) {
      setScoreRank("Good");
    } else if (score >= 50 && score <= 75) {
      setScoreRank("Fair");
    } else if (score < 50) {
      setScoreRank("Poor");
    }
  }, [scoreRank, score]);

  let badgeVariant: VariantProps<typeof badgeVariants>["variant"];

  if (scoreRank.toLowerCase() === "poor") {
    badgeVariant = "destructive";
  }

  if (scoreRank.toLowerCase() === "good") {
    badgeVariant = "success";
  }
  if (scoreRank.toLowerCase() === "fair") {
    badgeVariant = "warning";
  }

  return (
    <div className="h-full max-h-[380px] w-full flex flex-col justify-center gap-6 mx-auto px-4 relative">
      {/* Audit score */}
      <div className="flex items-center gap-2">
        <span className="text-black text-5xl ">{score.toFixed(0)}%</span>
        <Badge className="w-max font-semibold" variant={badgeVariant}>
          {scoreRank}
        </Badge>
      </div>

      <div>
        {/* Gradient bar */}
        <div className="w-full h-8 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-lg mx-auto  relative">
          {/* Needle */}
          <div
            className="absolute"
            style={{
              left: `${clampedScore - 5.6}%`, // Position needle based on score
              bottom: "-10%",
            }}
          >
            <Needle />
          </div>
        </div>
        {/* Labels */}
        <div className="flex items-center justify-between mt-2 text-xs text-secondary">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
}
