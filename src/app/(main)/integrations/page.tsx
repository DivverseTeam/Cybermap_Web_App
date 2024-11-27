import React from "react";
import IntegrationsPage from "~/containers/integrations/IntegrationsPage";
import { api } from "~/trpc/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integrations",
};

export default function page() {
  void api.integrations.get.prefetch();

  return <IntegrationsPage />;
}
