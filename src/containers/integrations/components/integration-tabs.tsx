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
import { api } from "~/trpc/react";

type Props = {
  setActiveList: React.Dispatch<React.SetStateAction<string>>;
  count: {
    all: number;
    connected: number;
  };
};

export function IntegrationTabs({
  setActiveList,
  count: { all, connected },
}: Props) {
  return (
    <Tabs
      defaultValue="connected"
      className="h-[500px] [@media(min-width:1400px)]:h-[886px] w-[200px] [@media(min-width:1400px)]:w-[270px] 2xl:w-[22%]"
    >
      <TabsList className="z-10 flex w-full rounded-2xl rounded-b-none border bg-muted">
        <TabsTrigger
          value="connected"
          className="rounded-2xl rounded-b-none rounded-tr-none"
          onClick={() => setActiveList("connected")}
        >
          Connected ({connected})
        </TabsTrigger>
        <TabsTrigger
          value="available"
          className="rounded-2xl rounded-b-none rounded-tl-none"
          onClick={() => setActiveList("available")}
        >
          Available ({all})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="connected">
        <Card className="rounded-t-none">
          <CardHeader>
            <CardTitle>Connected</CardTitle>
            {/* <CardDescription>
      <TabsContent value="connected">
        <Card className="rounded-t-none">
          <CardHeader>
            <CardTitle className="text-sm">Connected</CardTitle>
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
      <TabsContent value="available">
        <Card className="rounded-t-none">
          <CardHeader>
            <CardTitle className="text-sm">Available</CardTitle>
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
