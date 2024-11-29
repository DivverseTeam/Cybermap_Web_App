"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { frameworksWithControls } from "../ComplianceGuidePage";
import PageTitle from "~/components/PageTitle";
import { api } from "~/trpc/react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/_components/ui/tabs";
import ComplianceModules from "./components/compliance-modules";

const ProgressCard = dynamic(() => import("../components/progress-card"), {
  ssr: false,
});

type Props = {};

export default function ViewFrameworkCompliance({}: Props) {
  const params = useParams();
  const slug = params.slug as string;

  const [course] = api.frameworks.compliance.getCourse.useSuspenseQuery({
    slug,
  });

  const [activeTab, setActiveTab] = useState<"compliance" | "controls">(
    "compliance",
  );

  return (
    <div className="flex flex-col gap-4 2xl:gap-6">
      <PageTitle title={""} />

      {/* COMPLIANCE SUMMARY */}
      <div className="grid grid-cols-2 gap-4 2xl:gap-6">
        <ProgressCard
          total={course.readiness.total}
          completed={course.readiness.completed}
          tag="modules"
          title="Audit Readiness"
        />

        <ProgressCard
          total={course.readiness.total}
          completed={course.readiness.completed}
          tag="controls"
          title="Audit Preparedness"
        />
      </div>

      <Tabs defaultValue={activeTab}>
        <TabsList className="rounded-none bg-inherit">
          <TabsTrigger value="compliance">Compliance Modules</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
        </TabsList>
        <TabsContent value="compliance">
          <ComplianceModules course={course.modules} />
        </TabsContent>
        <TabsContent value="controls">Course</TabsContent>
      </Tabs>
    </div>
  );
}
