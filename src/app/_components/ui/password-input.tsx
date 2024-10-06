"use client";

import * as React from "react";

import { cn } from "~/lib/utils";
import { Input } from "./input";
import { EyeIcon, EyeOffIcon } from "@razorpay/blade/components";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    return (
      <Input
        type={showPassword ? "text" : "password"}
        suffix={
          showPassword ? (
            <span
              className="cursor-pointer"
              onClick={() => setShowPassword(false)}
            >
              <EyeIcon size="large" color="surface.icon.gray.muted" />
            </span>
          ) : (
            <span
              className="cursor-pointer"
              onClick={() => setShowPassword(true)}
            >
              <EyeOffIcon size="large" color="surface.icon.gray.muted" />
            </span>
          )
        }
        className={cn(
          "placeholder:text-gray-300 placeholder:text-[8px] placeholder:tracking-[0.4em] ",
          className
        )}
        {...props}
        ref={ref}
        placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
      />
    );
  }
);
Input.displayName = "Input";

export { PasswordInput };
