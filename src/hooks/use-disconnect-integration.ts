import type { Integration } from "~/lib/types/integrations";
import { api } from "~/trpc/react";

export const useDisconnectIntegration = () => {
  const {
    mutate: onDisconnect,
    isPending,
    isError,
    error,
  } = api.integrations.disconnect.useMutation();

  const onDisconnectIntegration = ({
    id,
    oauthProvider: provider,
  }: Integration) => {
    onDisconnect(
      {
        integrationId: id,
        ...(provider && { provider }),
      },
      {
        onSuccess: () => {
          window.location.reload();
          console.log("Integration disconnected successfully");
        },
        onError: (error) => {
          console.error("Error disconnecting integration:", error);
        },
      },
    );
  };

  return {
    onDisconnectIntegration,
    isPending,
    isError,
    error,
  };
};
