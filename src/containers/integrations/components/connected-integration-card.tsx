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
    <Card className="h-[210px] w-[250px] ">
      {/* <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader> */}
      <div className="flex flex-col justify-between p-3 px-0  mx-auto my-auto h-[230px]">
        <CardContent>
          <div className="flex flex-col gap-3 w-full">
            <div className="flex gap-3 justify-between items-start ">
              <Image
                src={integration.icon}
                alt="image"
                width={80}
                height={80}
                //   fill={true}
                //   objectFit="contain"
                //   objectPosition="center"
              />
              <span className="p-[2px] px-2 font-semibold text-xs rounded-lg text-green-700 bg-green-700/20">
                Active
              </span>
            </div>
            <div className="flex flex-col text-xs">
              <span className="text-secondary">
                Account ID:{" "}
                <span className="text-secondary-foreground">
                  CybermapProd23
                </span>
              </span>
              <span className="text-secondary">
                Workspace:{" "}
                <span className="text-secondary-foreground">Cybermap</span>
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="w-full mx-auto flex justify-center">
          <Button variant="outline" className="h-8 w-[234px]">
            View details
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
