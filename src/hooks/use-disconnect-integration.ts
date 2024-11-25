import type { Integration } from "~/lib/types/integrations";
import { api } from "~/trpc/react";

export const useDisconnectIntegration = () => {
  const {
    mutate: onDisconnect,
    isPending,
    isError,
    error,
  } = api.integrations.disconnect.useMutation();
  const utils = api.useUtils();

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
          console.log("Integration disconnected successfully");
          utils.integrations.get.invalidate();
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
