"use client";
import React from "react";
import PageTitle from "~/components/PageTitle";
import FrameworkCard from "./components/FrameworkCard";
import type { IFramework } from "./types";

type Props = {};

export const frameworksWithControls: IFramework[] = [
  {
    name: "ISO 27001",
    logo: "",
    controlsCompletion: {
      completedControls: 65,
      totalControls: 92,
    },
    modulesCompletion: {
      completedModules: 40,
      totalModules: 97,
    },
  },
  {
    name: "SOC 2",
    logo: "",
    controlsCompletion: {
      completedControls: 32,
      totalControls: 100,
    },
    modulesCompletion: {
      completedModules: 32,
      totalModules: 100,
    },
  },
];
export default function ComplianceGuidePage({}: Props) {
  return (
    <div>
      <PageTitle
        title="Compliance guide"
        subtitle="Track your progress towards framework compliance"
        // action={<NewControlSheet />}
      />
      <div className="grid grid-cols-2 2xl:grid-cols-3 gap-6">
        {frameworksWithControls.map((framework, idx) => (
          <FrameworkCard key={idx} framework={framework} />
        ))}
      </div>
    </div>
  );
}
