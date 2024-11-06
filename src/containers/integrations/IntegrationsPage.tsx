"use client";

import React, { useState } from "react";
import PageTitle from "~/components/PageTitle";
import AvailableIntegrationsContainer from "./components/available-integrations-container";
import ConnectedIntegrationsContainer from "./components/connected-integrations-container";
import { IntegrationTabs } from "./components/integration-tabs";
// import IntegrationList from "./components/available-integrations-list";

type Props = {};

export default function IntegrationsPage({}: Props) {
	const [activeList, setActiveList] = useState<string>("connected");

	console.log(activeList);
	return (
		<div className="flex flex-col gap-6">
			<PageTitle
				title="Integrations"
				subtitle="Connect your tools to enable real-time threat detection and automated responses"
			/>
			<div className="flex gap-6">
				<IntegrationTabs setActiveList={setActiveList} />
				{activeList === "available" ? (
					<AvailableIntegrationsContainer />
				) : (
					activeList === "connected" && <ConnectedIntegrationsContainer />
				)}
			</div>
		</div>
	);
}
