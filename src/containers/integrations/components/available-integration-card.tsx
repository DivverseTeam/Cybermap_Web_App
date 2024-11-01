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

export function AvailableIntegrationCard({ integration }: any) {
  return (
    <Card className="">
      {/* <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader> */}
      <div className="flex flex-col justify-between px-0  mx-auto my-auto h-[200px] 2xl:w-[266px]">
        <CardContent className="p-0 my-auto">
          <div className="flex flex-col items-center gap-2 justify-center ">
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
              <span className="text-sm font-semibold">{integration.name}</span>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-2 p-3 2xl:gap-3 ">
          <Button variant="outline" className="h-9 w-[110px]">
            See details
          </Button>
          <Button className="h-9 w-[110px]">Connect</Button>
        </CardFooter>
      </div>
    </Card>
  );
}
