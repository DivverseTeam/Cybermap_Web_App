import React from "react";
import PageTitle from "~/components/PageTitle";
import { IntegrationTabs } from "./components/integration-tabs";
import IntegrationList from "./components/integration-list";

type Props = {};

export default function IntegrationsPage({}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title="Integrations"
        subtitle="Connect your tools to enable real-time threat detection and automated responses"
      />
      <div className="flex gap-6">
        <IntegrationTabs />
        <IntegrationList />
      </div>
    </div>
  );
}
