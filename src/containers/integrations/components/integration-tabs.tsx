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
  setActiveCategory: React.Dispatch<
    React.SetStateAction<IntegrationCategory | string>
  >;
  activeCategory: IntegrationCategory | string;
  all: Array<Integration>;
  connected: Array<Integration>;
};

export function IntegrationTabs({
  setActiveList,
  setActiveCategory,
  activeCategory,
  all,
  connected,
}: Props) {
  const connectedCategoriesSet = new Set(
    connected.map((integration) => integration.category),
  );

  const connectedCategories = [
    { key: "All", value: "All" },
    ...Array.from(connectedCategoriesSet)
      .sort()
      .map((category) => ({
        key: category,
        value: IntegrationCategoryValueMap[category],
      })),
  ];

  const allCategoriesSet = new Set(
    all.map((integration) => integration.category),
  );

  const allCategories = [
    { key: "All", value: "All" },
    ...Array.from(allCategoriesSet)
      .sort()
      .map((category) => ({
        key: category,
        value: IntegrationCategoryValueMap[category],
      })),
  ];

  return (
    <Tabs
      defaultValue="connected"
      className="h-[500px] w-[200px] 2xl:w-[22%] [@media(min-width:1400px)]:h-[886px] [@media(min-width:1400px)]:w-[270px]"
    >
      <TabsList className="z-10 flex w-full rounded-2xl rounded-b-none border bg-muted">
        <TabsTrigger
          value="connected"
          className="rounded-2xl rounded-b-none rounded-tr-none"
          onClick={() => setActiveList("connected")}
        >
          Connected ({connected.length})
        </TabsTrigger>
        <TabsTrigger
          value="available"
          className="rounded-2xl rounded-b-none rounded-tl-none"
          onClick={() => setActiveList("available")}
        >
          Available ({all.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="connected">
        <Card className="rounded-t-none">
          <CardContent className="space-y-1 p-0">
            {/* Display list of connected integrations */}
            {connectedCategories.map((category) => (
              <div key={category.key} className="w-full">
                <Button
                  variant="ghost"
                  size={"lg"}
                  className={cn(
                    "w-full justify-start px-2 hover:bg-[#305EFF17]",
                    {
                      "!bg-[#305EFF17]":
                        (activeCategory === "" && category.key === "All") ||
                        activeCategory === category.key,
                    },
                  )}
                  type="button"
                  onClick={() =>
                    setActiveCategory(
                      category.key === "All" ? "" : category.key,
                    )
                  }
                >
                  {category.value}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="available">
        <Card className="rounded-t-none">
          <CardContent className="space-y-1 p-0">
            {allCategories.map((category) => (
              <div key={category.key} className="w-full">
                <Button
                  variant="ghost"
                  size={"lg"}
                  className={cn(
                    "w-full justify-start px-2 hover:bg-[#305EFF17]",
                    {
                      "!bg-[#305EFF17]":
                        (activeCategory === "" && category.key === "All") ||
                        activeCategory === category.key,
                    },
                  )}
                  type="button"
                  onClick={() =>
                    setActiveCategory(
                      category.key === "All" ? "" : category.key,
                    )
                  }
                >
                  {category.value}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
