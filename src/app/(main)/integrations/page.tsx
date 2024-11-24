import React from "react";
import IntegrationsPage from "~/containers/integrations/IntegrationsPage";
import { api } from "~/trpc/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integrations",
};

export default async function page() {
  const { connectedIntegrations, all } = await api.integrations.get();

  return (
    <>
      <IntegrationsPage
        integrations={{
          all,
          connected: connectedIntegrations,
        }}
      />
    </>
  );
}
