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

export function ConnectedIntegrationCard({ integration }: any) {
  return (
    <Card className="p-1">
      {/* <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader> */}
      <div className="flex flex-col justify-between p-0 px-0 gap-0  mx-auto my-auto h-[200px] 2xl:w-[266px]">
        <CardContent className="p-0 my-auto">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-1 justify-between px-4 items-start ">
              <div className="flex flex-col items-start gap-2 justify-center ">
                <Image
                  src={integration.icon}
                  alt="image"
                  width={70}
                  height={70}
                  //   fill={true}
                  // objectFit="contain"
                  // objectPosition="center"
                  className="flex items-center justify-center "
                />
                {["Github", "Github Enterprise Server"].includes(
                  integration.name
                ) && (
                  <span className="text-xs font-semibold">
                    {integration.name}
                  </span>
                )}
              </div>
              <span className="p-[2px] px-2 font-semibold text-xs rounded-lg text-green-700 bg-green-700/20">
                Active
              </span>
            </div>
            <div className="flex flex-col text-xs px-3">
              <span className="text-secondary">
                Account ID:{" "}
                <span className="text-secondary-foreground font-semibold">
                  CybermapProd23
                </span>
              </span>
              <span className="text-secondary">
                Workspace:{" "}
                <span className="text-secondary-foreground font-semibold">
                  Cybermap
                </span>
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-2 p-3 2xl:gap-3 ">
          <Button
            variant="outline"
            className="h-8 w-[234px] 2xl:h-9 2xl:w-[244px]"
          >
            View details
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
