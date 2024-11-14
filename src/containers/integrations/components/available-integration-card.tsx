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

type Integration = {
  id: string;
  name: string;
  icon: string;
};
type Props = {
  integration: Integration;
};

export function AvailableIntegrationCard({ integration }: Props) {
  return (
    <Card className="p-0 [@media(min-width:1400px)]:p-1">
      {/* <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader> */}
      <div className="mx-auto my-auto flex h-[180px] [@media(min-width:1400px)]:h-[200px] flex-col justify-between px-0 2xl:w-[266px]">
        <CardContent className="my-auto p-0">
          <div className="flex flex-col items-center justify-center gap-2 ">
            <Image
              src={integration.icon}
              alt="image"
              width={80}
              height={80}
              //   fill={true}
              // objectFit="contain"
              // objectPosition="center"
              className="flex items-center justify-center "
            />
            {["Github", "Github Enterprise Server"].includes(
              integration.name
            ) && (
              <span className="font-semibold text-xs [@media(min-width:1400px)]:text-sm">
                {integration.name}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-2 p-2 [@media(min-width:1400px)]:p-3 2xl:gap-3 ">
          <Button
            variant="outline"
            className="h-7 [@media(min-width:1400px)]:h-9 w-[75px] [@media(min-width:1400px)]:w-[110px] text-xs [@media(min-width:1400px)]:text-sm"
          >
            See details
          </Button>
          <Button className="h-7 [@media(min-width:1400px)]:h-9 w-[75px] [@media(min-width:1400px)]:w-[110px] text-xs [@media(min-width:1400px)]:text-sm">
            Connect
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
