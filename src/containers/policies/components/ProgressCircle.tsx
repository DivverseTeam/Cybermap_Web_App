import { type VariantProps, cva } from "class-variance-authority";
import type { FunctionComponent } from "react";
import { cn } from "~/lib/utils";

const progressCircleVariants = cva("relative", {
  variants: {
    size: {
      sm: "h-8 w-8",
      lg: "h-10 w-10",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

export interface ProgressCircleProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof progressCircleVariants> {
  value: number;
  max: number;
}

const ProgressCircle: FunctionComponent<ProgressCircleProps> = ({
  value,
  max,
  size,
  className,
}) => {
  const radius = 16;
  const progressPercentage = (value / max) * 100;
  const strokeDasharray = 2 * Math.PI * radius;
  const strokeDashoffset = ((100 - progressPercentage) * strokeDasharray) / 100;

  return (
    <div className={cn(progressCircleVariants({ size, className }))}>
      <svg className="h-full w-full text-sm" viewBox="0 0 48 48">
        <circle
          className="stroke-current text-[#E5E5EF]"
          strokeWidth="3"
          cx="24"
          cy="24"
          r={radius}
          fill="transparent"
        ></circle>

        <circle
          className="progress-ring__circle stroke-current text-[#2B9A66]"
          strokeWidth="4"
          strokeLinecap="round"
          cx="24"
          cy="24"
          r={radius}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
        ></circle>
      </svg>
    </div>
  );
};

ProgressCircle.displayName = "ProgressCircle";

export { ProgressCircle, progressCircleVariants };
