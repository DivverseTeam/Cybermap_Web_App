import { Button } from "~/app/_components/ui/button";
import { Card, CardContent } from "~/app/_components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/_components/ui/tabs";
import { IntegrationCategoryValueMap } from "~/lib/constants/integrations";
import type {
  Integration,
  IntegrationCategory,
} from "~/lib/types/integrations";
import { cn } from "~/lib/utils";

type Props = {
  setActiveList: React.Dispatch<React.SetStateAction<string>>;
};

export function ComplianceTabs({ setActiveList }: Props) {
  return (
    <Tabs defaultValue="complianceModules">
      <TabsList className="bg-inherit rounded-none">
        <TabsTrigger
          value="complianceModules"
          onClick={() => setActiveList("complianceModules")}
        >
          Compliance modules
        </TabsTrigger>
        <TabsTrigger value="controls" onClick={() => setActiveList("controls")}>
          Controls
        </TabsTrigger>
      </TabsList>

      <TabsContent value="complianceModules">
        <Card className="rounded-t-none">
          <CardContent className="space-y-1 p-0">
            {/* Display compliance modules info */}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="controls">
        <Card className="rounded-t-none">
          <CardContent className="space-y-1 p-0">
            {/* Display controls info */}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
