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
    <Card className="h-[200px] w-[250px]">
      {/* <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader> */}
      <div className=" gap-4 flex flex-col justify-between items-center mx-auto p-3 h-[220px]">
        <CardContent>
          <Image
            src={integration.icon}
            alt="image"
            width={100}
            height={100}
            //   fill={true}
            objectFit="contain"
            objectPosition="center"
          />
        </CardContent>
        <CardFooter className="flex justify-between gap-2">
          <Button variant="outline" className="h-8 w-[108px]">
            See details
          </Button>
          <Button className="h-8 w-[108px]">Connect</Button>
        </CardFooter>
      </div>
    </Card>
  );
}
