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
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "~/app/_components/ui/tabs";

type Props = {
	setActiveList: React.Dispatch<React.SetStateAction<string>>;
};

export function IntegrationTabs({ setActiveList }: Props) {
	return (
		<Tabs defaultValue="connected" className="h-[886px] w-[266px] 2xl:w-[22%]">
			<TabsList className="z-10 grid w-full grid-cols-2 rounded-2xl rounded-b-none border bg-muted">
				<TabsTrigger
					value="connected"
					className="rounded-2xl rounded-b-none rounded-tr-none"
					onClick={() => setActiveList("connected")}
				>
					Connected ({4})
				</TabsTrigger>
				<TabsTrigger
					value="available"
					className="rounded-2xl rounded-b-none rounded-tl-none"
					onClick={() => setActiveList("available")}
				>
					Available ({200})
				</TabsTrigger>
			</TabsList>

			<TabsContent value="connected">
				<Card className="rounded-t-none">
					<CardHeader>
						<CardTitle>Connected</CardTitle>
						{/* <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription> */}
					</CardHeader>
					<CardContent className="space-y-2">
						{/* Display list of connected integrations */}
						<div>List of Connected integrations...</div>
					</CardContent>
				</Card>
			</TabsContent>

			<TabsContent value="available">
				<Card className="rounded-t-none">
					<CardHeader>
						<CardTitle>Available</CardTitle>
						{/* <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription> */}
					</CardHeader>
					<CardContent className="space-y-2">
						{/* Display list of all available integrations */}
						<div>List of Available integrations...</div>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	);
}
