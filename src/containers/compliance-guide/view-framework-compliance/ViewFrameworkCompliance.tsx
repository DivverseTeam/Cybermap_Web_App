"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import PageTitle from "~/components/PageTitle";
import { api } from "~/trpc/react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/_components/ui/tabs";
import ComplianceModules from "./components/compliance-modules";
import ComplianceControls from "./components/compliance-controls";

const ProgressCard = dynamic(() => import("../components/progress-card"), {
  ssr: false,
});

type Props = {};

export default function ViewFrameworkCompliance({}: Props) {
  const params = useParams();
  const frameworkSlug = params["framework-slug"] as string;

  const [course] = api.frameworks.compliance.getCourse.useSuspenseQuery({
    slug: frameworkSlug,
  });
  const [frameworks] = api.frameworks.getWithCompletion.useSuspenseQuery();

  const framework = frameworks.find(
    (framework) => framework.slug === frameworkSlug,
  );
  const {
    controls = [],
    complianceScore: { passing = 0, failing = 0, risk = 0 } = {},
  } = framework || {};

  return (
    <div className="flex flex-col gap-4 2xl:gap-6">
      <PageTitle title={""} />

      <div className="grid grid-cols-2 gap-4 2xl:gap-6">
        <ProgressCard
          total={course.readiness.total}
          completed={course.readiness.completed}
          tag="modules"
          title="Audit Readiness"
        />

        <ProgressCard
          total={passing + failing + risk}
          completed={passing}
          tag="controls"
          title="Audit Preparedness"
        />
      </div>

      <Tabs
        defaultValue="compliance"
        className="flex flex-col items-start gap-5"
      >
        <TabsList className="rounded-none bg-inherit">
          <TabsTrigger value="compliance">Compliance Modules</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
        </TabsList>
        <TabsContent value="compliance" className="w-full">
          <ComplianceModules course={course.modules} />
        </TabsContent>
        <TabsContent value="controls" className="w-full">
          <ComplianceControls controls={controls} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
