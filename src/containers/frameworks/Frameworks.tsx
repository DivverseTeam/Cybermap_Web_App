"use client";

import { Button } from "~/app/_components/ui/button";
import PageTitle from "~/components/PageTitle";
import { frameworkList } from "./_lib/constants";
import FrameworkMonitorCard from "./components/FrameworkMonitorCard";

export default function FrameworksPage() {
  return (
    <div className="flex flex-col gap-4 [@media(min-width:1400px)]:gap-6">
      <PageTitle
        title="Frameworks"
        subtitle="Monitor and manage all your frameworks"
        action={<Button>Add new framework</Button>}
      />
      <div className="flex flex-wrap gap-6">
        {frameworkList.map((framework, idx) => (
          <FrameworkMonitorCard key={idx} framework={framework} />
        ))}
      </div>
    </div>
  );
}
