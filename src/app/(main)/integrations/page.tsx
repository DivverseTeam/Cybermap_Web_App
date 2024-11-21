import React from "react";
import IntegrationsPage from "~/containers/integrations/IntegrationsPage";
import { api } from "~/trpc/server";

export default async function page() {
  const { connectedIntegrations, nonConnectedIntegrations } =
    await api.integrations.getIntegrations();

  return (
    <IntegrationsPage
      integrations={{
        all: nonConnectedIntegrations,
        connected: connectedIntegrations,
      }}
    />
  );
}
