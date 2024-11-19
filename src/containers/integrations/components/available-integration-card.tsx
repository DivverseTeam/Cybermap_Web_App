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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";
import type { Integration } from "~/lib/types/integrations";
import { api } from "~/trpc/react";

type Props = {
  integration: Integration;
};

export function AvailableIntegrationCard({ integration }: Props) {
  const { mutate } = api.general.oauth2.authorization.useMutation();

  const onConnectIntegration = () => {
    mutate("MICROSOFT", {
      onSuccess: (data) => {
        window.open(data);
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
          >
            Connect
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
