"use client";

import React from "react";
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
import ProgressCard from "../components/progress-card";

type Props = {};

export default function ViewFrameworkCompliance({}: Props) {
  const params = useParams();
  const frameworkSlug = params["framework-slug"] as string;

  const [course] = api.frameworks.compliance.getCourse.useSuspenseQuery({
    slug: frameworkSlug,
  });
  const [frameworks] = api.frameworks.getWithCompletion.useSuspenseQuery();

  const framework = frameworks.find(
    (framework) => framework.slug === frameworkSlug
  );
  const { controls = [] } = framework || {};

  return (
    <div className="flex flex-col gap-4 2xl:gap-6">
      <PageTitle title={""} />

      <div className="grid grid-cols-2 gap-4 2xl:gap-6">
        <ProgressCard
          total={course.preparedness.total}
          completed={course.preparedness.completed}
          title="Preparedness"
        />
        <ProgressCard
          total={course.readiness.total}
          completed={course.readiness.completed}
          title="Audit Readiness"
        />
      </div>

      <Tabs
        defaultValue="compliance"
        className="flex flex-col items-start gap-5"
      >
        <TabsList className="rounded-none bg-inherit border-b-2 w-full flex justify-start">
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
