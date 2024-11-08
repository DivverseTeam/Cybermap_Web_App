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

export function ConnectedIntegrationCard({ integration }: Props) {
	return (
		<Card className="p-1">
			{/* <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader> */}
			<div className="mx-auto my-auto flex h-[200px] flex-col justify-between gap-0 p-0 px-0 2xl:w-[266px]">
				<CardContent className="my-auto p-0">
					<div className="flex w-full flex-col gap-2">
						<div className="flex items-start justify-between gap-1 px-4 ">
							<div className="flex flex-col items-start justify-center gap-2 ">
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
									integration.name,
								) && (
									<span className="font-semibold text-xs">
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
