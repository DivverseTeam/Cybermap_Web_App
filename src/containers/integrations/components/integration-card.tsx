import Image from "next/image";
import * as React from "react";
import { useState } from "react";
import { Badge } from "~/app/_components/ui/badge";

import { Button } from "~/app/_components/ui/button";
import { Card, CardContent, CardFooter } from "~/app/_components/ui/card";
import { IntegrationCategoryValueMap } from "~/lib/constants/integrations";
import type { Integration, Oauth2Provider } from "~/lib/types/integrations";
import { cn, getProviderByIntegrationId } from "~/lib/utils";
import { api } from "~/trpc/react";

type Props = {
  integration: Integration & { isConnected: boolean };
};

export function openAuthPopup(
  url: string,
  windowName: string,
  width = 600,
  height = 700,
): Window | null {
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const popup = window.open(
    url,
    windowName,
    `width=${width},height=${height},top=${top},left=${left},resizable,scrollbars,status`,
  );

  return popup;
}

export function IntegrationCard({ integration }: Props) {
  const { image, name, category, isConnected } = integration;
  const [_authStatus, setAuthStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [_authError, setAuthError] = useState<string | null>(null);

  const {
    mutate: disconnectIntegrationMutate,
    isPending: disconnectIsPending,
  } = api.integrations.disconnectIntegration.useMutation();
  const { mutate: oauth2Mutate, isPending: oauth2IsPending } =
    api.general.oauth2.authorization.useMutation();

  const provider = getProviderByIntegrationId(integration.id);

  const onDisconnectIntegration = () => {
    disconnectIntegrationMutate(
      { integrationId: integration.id, ...(provider && { provider }) },
      {
        onSuccess: () => {
          window.location.reload();
        },
        onError: (error) => {
          console.log({ error });
        },
      },
    );
  };

  const handleConnection = (url: string) => {
    const popup = openAuthPopup(url, "Login");

    if (!popup) {
      alert("Failed to open popup. Please allow popups for this site.");
      return;
    }

    const messageHandler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return; // Ignore messages from unknown origins
      }

      const { success, error } = event.data;
      if (success) {
        setAuthStatus("success");
        popup.close();
        window.location.reload(); // Force refresh on success
      } else {
        setAuthStatus("error");
        setAuthError(error || "An unknown error occurred");
        popup.close();
      }
    };

    window.addEventListener("message", messageHandler);

    // Cleanup the event listener when the popup is closed
    const popupInterval = setInterval(() => {
      if (popup.closed) {
        clearInterval(popupInterval);
        window.removeEventListener("message", messageHandler);
      }
    }, 500);
  };

  const onConnectIntegration = () => {
    oauth2Mutate(provider as Oauth2Provider, {
      onSuccess: (data) => {
        handleConnection(data);
      },
      onError: (error) => {
        console.log({ error });
      },
    });
  };

  const isPending = disconnectIsPending || oauth2IsPending;

  const onButtonClick = isConnected
    ? onDisconnectIntegration
    : onConnectIntegration;

  return (
    <div className="w-full rounded-lg border bg-white p-4 shadow-md">
      <div className="flex flex-col gap-y-12">
        <div className="flex items-center justify-between">
          <Image
            src={image}
            alt={`${name} Logo`}
            width={64}
            height={64}
            className="flex h-16 items-center justify-center rounded-md border-2 p-2"
          />
          <Button
            size="sm"
            variant="outline"
            loading={isPending}
            onClick={onButtonClick}
            className={cn("border-2", {
              "border-red-500 text-red-500 hover:bg-red-500 hover:text-white":
                isConnected,
            })}
          >
            {isConnected ? "Disconnect" : "Connect"}
          </Button>
        </div>

        <div className="flex flex-col gap-y-1">
          <h2 className="inline-flex items-center gap-x-4 font-medium text-gray-900 text-lg">
            {name}
            <Badge variant={isConnected ? "success" : "muted"}>
              {isConnected ? "Connected" : "Inactive"}
            </Badge>
          </h2>
          <p className="text-gray-500 text-sm">
            {IntegrationCategoryValueMap[category]}
          </p>
        </div>
      </div>
    </div>
  );
}
