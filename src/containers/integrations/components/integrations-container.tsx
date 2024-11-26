import { Search01Icon } from "hugeicons-react";
import React, { useState } from "react";
import { Input } from "~/app/_components/ui/input";
import { IntegrationCard } from "./integration-card";
import type { Integration } from "~/lib/types/integrations";
import IntegrationConnectionModal from "./integration-connection-modal";
import { z } from "zod";
import { useConnectIntegration } from "~/hooks/use-connect-integration";
import { useDisconnectIntegration } from "~/hooks/use-disconnect-integration";

type Props = {
  integrations: Array<Integration & { isConnected?: boolean }>;
  isConnected: boolean;
};

export default function IntegrationsContainer({
  integrations,
  isConnected,
}: Props) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedIntegration, setSelectedIntegration] = useState<
    (Integration & { isConnected: boolean }) | null
  >(null);

  const { onConnectIntegration, isPending: isConnectPending } =
    useConnectIntegration();
  const { onDisconnectIntegration, isPending: isDisconnectPending } =
    useDisconnectIntegration();
  const isPending = isConnectPending || isDisconnectPending;

  const onIntegrationCardActionClick = (
    integration: Integration & { isConnected: boolean },
  ) => {
    if (!integration?.isConnected) {
      setSelectedIntegration(integration);
      setDialogOpen(true);
    } else {
      onDisconnectIntegration(integration);
    }
  };

  return (
    <div className="flex grow flex-col">
      <div className="mx-auto flex w-full justify-between rounded-2xl rounded-b-none border bg-muted p-2 2xl:p-5 [@media(min-width:1400px)]:p-4">
        <Input
          type="text"
          placeholder="Search for connected integrations"
          className="w-60 rounded-md bg-[#F9F9FB] [@media(min-width:1400px)]:w-72"
          suffix={
            <span className="cursor-pointer">
              <Search01Icon size="12" />
            </span>
          }
        />
      </div>
      <div className="border bg-white p-8">
        <div className="mb-4 [@media(min-width:1400px)]:mb-6">
          <h2 className="font-semibold text-lg [@media(min-width:1400px)]:text-xl">
            {`${isConnected ? "Connected" : "All"} integrations`}
          </h2>
          <p className="text-gray-600 text-xs [@media(min-width:1400px)]:text-sm">
            Go through and access {isConnected ? "connected" : "all"}{" "}
            integrations in here
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 xl:gap-8">
          {integrations.map((integration, index: number) => (
            <IntegrationCard
              key={index}
              integration={{
                ...integration,
                isConnected: integration.isConnected || isConnected,
              }}
              onClickAction={onIntegrationCardActionClick}
              isPending={
                selectedIntegration?.id === integration.id && isPending
              }
            />
          ))}
        </div>
      </div>
      {selectedIntegration && (
        <IntegrationConnectionModal
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          integration={selectedIntegration}
          onSubmit={(data) => {
            onConnectIntegration({ integration: selectedIntegration, data });
            setDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}
