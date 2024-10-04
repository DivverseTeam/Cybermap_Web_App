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
        className={className}
        {...props}
        ref={ref}
      />
    );
  }
);
Input.displayName = "Input";

export { PasswordInput };
