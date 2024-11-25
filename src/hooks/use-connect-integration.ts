import { useState } from "react";
import type { Integration } from "~/lib/types/integrations";
import { api } from "~/trpc/react";

const openAuthPopup = (
  url: string,
  windowName?: string,
  width = 600,
  height = 700,
): Window | null => {
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const popup = window.open(
    url,
    windowName,
    `width=${width},height=${height},top=${top},left=${left},resizable,scrollbars,status`,
  );

  return popup;
};

export const useConnectIntegration = () => {
  const [authStatus, setAuthStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [authError, setAuthError] = useState<string | null>(null);
  const utils = api.useUtils();

  const handleConnection = (url: string) => {
    const popup = openAuthPopup(url, "Login");

    if (!popup) {
      alert("Failed to open popup. Please allow popups for this site.");
      return;
    }

    const messageHandler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      const { success, error } = event.data;
      if (success) {
        setAuthStatus("success");
        popup.close();
        utils.integrations.get.invalidate();
      } else {
        setAuthStatus("error");
        setAuthError(error || "An unknown error occurred");
        popup.close();
      }
    };

    window.addEventListener("message", messageHandler);

    const popupInterval = setInterval(() => {
      if (popup.closed) {
        clearInterval(popupInterval);
        window.removeEventListener("message", messageHandler);
      }
    }, 500);
  };

  const {
    mutate: oauth2AuthorizationMutation,
    isPending,
    isError,
    error,
  } = api.general.oauth2.authorization.useMutation();

  const onConnectIntegration = ({
    integration,
    data,
  }: {
    integration: Integration;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    data: any;
  }) => {
    const { oauthProvider } = integration;
    if (oauthProvider) {
      oauth2AuthorizationMutation(
        {
          provider: oauthProvider,
          ...data,
        },
        {
          onSuccess: (data) => {
            handleConnection(data.url);
          },
          onError: (error) => {
            setAuthStatus("error");
            setAuthError(error.message || "An unknown error occurred");
          },
        },
      );
    }
  };

  return {
    onConnectIntegration,
    isPending: isPending || authError === "idle",
    isError: isError || authStatus === "error",
    error: error || authError,
  };
};
