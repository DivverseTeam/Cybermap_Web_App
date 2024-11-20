import React from "react";
import IntegrationsPage from "~/containers/integrations/IntegrationsPage";
import { api } from "~/trpc/server";

export default async function page() {
  const allIntegrations = await api.integrations.getAllIntegrations();
  const connectedIntegrations =
    await api.integrations.getConnectedIntegrations();

  return (
    <IntegrationsPage
      integrations={{
        all: allIntegrations,
        connected: connectedIntegrations,
      }}
    />
  );
}
