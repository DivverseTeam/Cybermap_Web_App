"use client";

import dynamic from "next/dynamic";
import { Button } from "~/app/_components/ui/button";
import PageTitle from "~/components/PageTitle";
import type { OrganisationFramework } from "~/lib/types/frameworks";
import { api } from "~/trpc/react";

const FrameworkMonitorCard = dynamic(
  () => import("./components/FrameworkMonitorCard"),
  { ssr: false },
);

export default function FrameworksPage() {
  const [frameworks] = api.frameworks.getWithCompletion.useSuspenseQuery();

  return (
    <div className="flex flex-col gap-4 [@media(min-width:1400px)]:gap-6">
      <PageTitle
        title="Frameworks"
        subtitle="Monitor and manage all your frameworks"
        action={<Button>Add new framework</Button>}
      />
      <div className="flex flex-wrap gap-6">
        {frameworks.map((framework, idx) => (
          <FrameworkMonitorCard key={idx} framework={framework} />
        ))}
      </div>
    </div>
  );
}
