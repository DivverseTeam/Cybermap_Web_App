import React from "react";
import type { Metadata } from "next";
import ComplianceGuidePage from "~/containers/compliance-guide/ComplianceGuidePage";
import { api } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Compliance Guide",
};

export default function page() {
  void api.frameworks.getWithCompletion.prefetch();
  return <ComplianceGuidePage />;
}
