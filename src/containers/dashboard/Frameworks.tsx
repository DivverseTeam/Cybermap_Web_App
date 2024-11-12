"use client";

import { Button } from "~/app/_components/ui/button";
import PageTitle from "~/components/PageTitle";
import FrameworkMonitorCard from "./FrameworkMonitorCard";
import { frameworklist } from "./constants";

export default function FrameworksPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title="Frameworks"
        subtitle="Monitor and manage all your frameworks"
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline">Customize widgets</Button>
            <Button>Create custom framework</Button>
          </div>
        }
      />
      <div className="flex flex-wrap gap-6 p-6">
        {frameworklist.map((item, idx) => (
          <FrameworkMonitorCard key={idx} {...item} />
        ))}
      </div>
    </div>
  );
}
