import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "~/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent font-medium text-[#305EFF] bg-[#305EFF17]",
        secondary:
          "border-transparent font-medium text-[#62636C] bg-[#6C849D17]",
        destructive:
          "border-[#D92D20] font-medium text-[#D92D20] bg-[#D92D2017]",
        outline: "text-foreground font-medium",
        success: "text-[#008743] font-medium bg-[#00A25117]",
        warning: "text-[#C65C10] font-medium bg-[#E9690C17]",
        muted: "text-[#243547] font-medium bg-[#6C849D17]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
