"use client";

import React, { useState } from "react";
import PageTitle from "~/components/PageTitle";
import AvailableIntegrationsContainer from "./components/available-integrations-container";
import ConnectedIntegrationsContainer from "./components/connected-integrations-container";
import { IntegrationTabs } from "./components/integration-tabs";
import type { Integration } from "~/lib/types/integrations";
// import IntegrationList from "./components/available-integrations-list";

type Props = {
  integrations: {
    all: Array<Integration>;
    connected: Array<Integration>;
  };
};

export default function IntegrationsPage({
  integrations: { all, connected },
}: Props) {
  const [activeList, setActiveList] = useState<string>("connected");
  return (
    <div className="flex flex-col gap-4 [@media(min-width:1400px)]:gap-6">
      <PageTitle
        title="Integrations"
        subtitle="Connect your tools to enable real-time threat detection and automated responses"
      />
      <div className="flex gap-4 [@media(min-width:1400px)]:gap-6">
        <IntegrationTabs
          setActiveList={setActiveList}
          count={{
            all: all.length,
            connected: connected.length,
          }}
        />
        {activeList === "available" ? (
          <AvailableIntegrationsContainer integrations={all} />
        ) : (
          activeList === "connected" && (
            <ConnectedIntegrationsContainer integrations={connected} />
          )
        )}
      </div>
    </div>
  );
}
