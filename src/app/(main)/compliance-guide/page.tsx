import React from "react";
import type { Metadata } from "next";
import ComplianceGuidePage from "~/containers/compliance-guide/ComplianceGuidePage";

export const metadata: Metadata = {
  title: "Compliance guide",
};

export default function page() {
  return <ComplianceGuidePage />;
}
