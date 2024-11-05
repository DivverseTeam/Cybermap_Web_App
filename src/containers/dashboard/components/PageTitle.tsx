import React from "react";
import { cn } from "~/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  description: string;
  className?: string;
};

export default function PageTitle({
  title,
  subtitle,
  description,
  className,
}: Props) {
  return (
    <div className="flex flex-col gap-4 py-6">
      <div
        className={cn(
          "text-[16px] font-semibold w-full flex gap-2 items-baseline bg-[#F9F9FB] ",
          className
        )}
      >
        <span
          className={`${
            subtitle ? "text-[#80838D] font-normal " : "text-black"
          }`}
        >
          {title}
        </span>
        {subtitle && <span className="mx-0">/</span>}
        <span className="text-black">{subtitle}</span>
      </div>
      <div className="text-black flex flex-col gap-2">
        <span className="font-semibold text-xl">{subtitle}</span>
      </div>
    </div>
  );
}
