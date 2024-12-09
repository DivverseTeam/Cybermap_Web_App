"use client";

import React from "react";
import PageTitle from "~/components/PageTitle";
import { api } from "~/trpc/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FrameworkComplianceCard from "./components/framework-compliance-card";

export default function ComplianceGuidePage() {
  const [frameworks] = api.frameworks.getWithCompletion.useSuspenseQuery();
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title="Compliance Guide"
        subtitle="Track your progress towards framework compliance"
      />
      <div className="grid grid-cols-2 gap-6 2xl:grid-cols-3">
        {frameworks.map((framework, idx) => {
          const {
            logo,
            name,
            slug,
            // complianceScore: { passing, failing, risk },
            preparedness,
          } = framework;

          return (
            <Link key={idx} href={`${pathname}/${slug}`}>
              <FrameworkComplianceCard
                name={name}
                logo={logo}
                preparedness={preparedness}
                readiness={preparedness}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
