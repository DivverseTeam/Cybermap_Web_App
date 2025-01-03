import * as React from "react";

import { cn } from "~/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  suffix?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ suffix, className, type, ...props }, ref) => {
    return (
      <div className="relative flex items-center gap-2">
        <input
          type={type}
          className={cn(
            "flex h-7 [@media(min-width:1400px)]:h-10 w-full rounded-sm border border-input bg-background px-3 py-2 text-xs [@media(min-width:1400px)]:text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-xs [@media(min-width:1400px)]:file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        <div className="absolute right-4">{suffix}</div>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
