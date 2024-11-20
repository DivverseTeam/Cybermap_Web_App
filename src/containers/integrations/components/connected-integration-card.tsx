import Image from "next/image";
import * as React from "react";

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
import type { Integration } from "~/lib/types/integrations";
import { getProviderByIntegrationId } from "~/lib/utils";
import { api } from "~/trpc/react";

type Props = {
  integration: Integration;
};

export function ConnectedIntegrationCard({ integration }: Props) {
  const { mutate, isPending } =
    api.integrations.disconnectIntegration.useMutation();

  const provider = getProviderByIntegrationId(integration.id);

  const disconnectIntegration = () => {
    mutate(
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

  return (
    <Card className="p-0 [@media(min-width:1400px)]:p-1">
      <div className="mx-auto my-auto flex h-[200px] flex-col justify-center gap-0 p-0 px-0 2xl:w-[266px]">
        <CardContent className="my-auto p-0">
          <div className="flex w-full flex-col gap-1 [@media(min-width:1400px)]:gap-2">
            <div className="flex items-start justify-between gap-1 px-3 [@media(min-width:1400px)]:px-4 ">
              <div className="flex flex-col items-start justify-center gap-1 [@media(min-width:1400px)]:gap-2 ">
                <Image
                  src={integration.image}
                  alt="image"
                  width={70}
                  height={70}
                  //   fill={true}
                  // objectFit="contain"
                  // objectPosition="center"
                  className="flex items-center justify-center "
                />
                {["Github", "Github Enterprise Server"].includes(
                  integration.name,
                ) && (
                  <span className="whitespace-nowrap font-semibold text-[7px] [@media(min-width:1400px)]:text-xs">
                    {integration.name}
                  </span>
                )}
              </div>
              <span className="rounded-lg bg-green-700/20 p-[2px] px-2 font-semibold text-green-700 text-xs">
                Active
              </span>
            </div>
            <div className="flex flex-col px-3 text-xs">
              <span className="text-secondary">
                Account ID:{" "}
                <span className="font-semibold text-secondary-foreground">
                  CybermapProd23
                </span>
              </span>
              <span className="text-secondary">
                Workspace:{" "}
                <span className="font-semibold text-secondary-foreground">
                  Cybermap
                </span>
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-1 p-2 [@media(min-width:1400px)]:p-3 2xl:gap-3 ">
          <Button
            variant="destructive"
            loading={isPending}
            onClick={disconnectIntegration}
          >
            Disconnect
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
