"use client";

import React, { useState } from "react";
import PageTitle from "~/components/PageTitle";
import { IntegrationTabs } from "./components/integration-tabs";
import type {
  Integration,
  IntegrationCategory,
} from "~/lib/types/integrations";
import IntegrationsContainer from "./components/integrations-container";
import { api } from "~/trpc/react";
// import IntegrationList from "./components/available-integrations-list";

type Props = {};

export default function IntegrationsPage({}: Props) {
  const [{ connected, all }] = api.integrations.get.useSuspenseQuery();

  const [activeList, setActiveList] = useState<string>("connected");
  const [activeCategory, setActiveCategory] = useState<
    IntegrationCategory | string
  >("");

  const filteredAll = activeCategory
    ? all.filter((integration) => integration.category === activeCategory)
    : all;
  const filteredConnected = activeCategory
    ? connected.filter((integration) => integration.category === activeCategory)
    : connected;

  return (
    <div className="flex flex-col gap-4 [@media(min-width:1400px)]:gap-6 px-4 [@media(min-width:1400px)]:px-6">
      <PageTitle
        title="Integrations"
        subtitle="Connect your tools to enable real-time threat detection and automated responses"
      />
      <div className="flex gap-4 [@media(min-width:1400px)]:gap-6">
        <IntegrationTabs
          setActiveList={setActiveList}
          setActiveCategory={setActiveCategory}
          activeCategory={activeCategory}
          all={all}
          connected={connected}
        />
        {activeList === "available" ? (
          <IntegrationsContainer
            integrations={filteredAll}
            isConnected={false}
          />
        ) : (
          activeList === "connected" && (
            <IntegrationsContainer
              integrations={filteredConnected}
              isConnected={true}
            />
          )
        )}
      </div>
    </div>
  );
}
