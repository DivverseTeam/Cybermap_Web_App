"use client";

import FrameworkMonitorCard from "./FrameworkMonitorCard";
import { frameworklist } from "./constants";

export default function FrameworksPage() {
  return (
    <div className="flex flex-col pb-6">
      <div className="flex flex-row h-24 w-full items-end justify-between pb-2 px-6">
        <div className="flex flex-col gap-1">
          <p className="text-xl font-semibold text-neutral-12">Frameworks</p>
          <p className="text-base text-neutral-11">
            Monitor and manage all your frameworks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-[40px] p-4 bg-white rounded-sm border border-solid flex items-center justify-center border-neutral-5 font-medium text-sm text-neutral-11">
            Customize widgets
          </div>
          <div className="bg-[#305EFF] h-[40px] rounded-sm border border-solid flex items-center justify-center border-neutral-5 font-medium text-sm text-white p-4">
            Create custom framework
          </div>
        </div>
      </div>
      <div className="p-6 flex gap-6 flex-wrap">
        {frameworklist.map((item) => (
          <FrameworkMonitorCard {...item} />
        ))}
      </div>
    </div>
  );
}
