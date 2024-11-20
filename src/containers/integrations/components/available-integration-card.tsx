import Image from "next/image";
import * as React from "react";
import { useState } from "react";

import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";
import type { Integration, Oauth2Provider } from "~/lib/types/integrations";
import { getProviderByIntegrationId } from "~/lib/utils";
import { api } from "~/trpc/react";

type Props = {
  integration: Integration;
};

export function openAuthPopup(
  url: string,
  windowName: string,
  width = 500,
  height = 600,
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

export function AvailableIntegrationCard({ integration }: Props) {
  const { mutate, isPending } = api.general.oauth2.authorization.useMutation();
  const [authStatus, setAuthStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [authError, setAuthError] = useState<string | null>(null);

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

  const provider = getProviderByIntegrationId(integration.id);

  const onConnectIntegration = () => {
    mutate(provider as Oauth2Provider, {
      onSuccess: (data) => {
        handleConnection(data);
      },
      onError: (error) => {
        console.log({ error });
      },
    });
  };

  return (
    <Card className="p-0 [@media(min-width:1400px)]:p-1">
      {/* <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader> */}
      <div className="mx-auto my-auto flex h-[180px] flex-col justify-between px-0 2xl:w-[266px] [@media(min-width:1400px)]:h-[200px]">
        <CardContent className="my-auto p-0">
          <div className="flex flex-col items-center justify-center gap-2 ">
            <Image
              src={integration.image}
              alt="image"
              width={80}
              height={80}
              //   fill={true}
              // objectFit="contain"
              // objectPosition="center"
              className="flex items-center justify-center "
            />
            {["Github", "Github Enterprise Server"].includes(
              integration.name,
            ) && (
              <span className="font-semibold text-xs [@media(min-width:1400px)]:text-sm">
                {integration.name}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-2 p-2 2xl:gap-3 [@media(min-width:1400px)]:p-3 ">
          <Button
            variant="outline"
            className="h-7 w-[75px] text-xs [@media(min-width:1400px)]:h-9 [@media(min-width:1400px)]:w-[110px] [@media(min-width:1400px)]:text-sm"
          >
            See details
          </Button>
          <Button
            className="h-7 w-[75px] text-xs [@media(min-width:1400px)]:h-9 [@media(min-width:1400px)]:w-[110px] [@media(min-width:1400px)]:text-sm"
            onClick={onConnectIntegration}
            loading={isPending}
          >
            Connect
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
