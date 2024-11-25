import Image from "next/image";
import { Badge } from "~/app/_components/ui/badge";
import { Button } from "~/app/_components/ui/button";
import { IntegrationCategoryValueMap } from "~/lib/constants/integrations";
import type { Integration } from "~/lib/types/integrations";
import { cn } from "~/lib/utils";

type Props = {
  integration: Integration & { isConnected: boolean };
  onClickAction: (integration: Integration & { isConnected: boolean }) => void;
  isPending?: boolean;
};

export function IntegrationCard({
  integration,
  onClickAction,
  isPending,
}: Props) {
  const { image, name, category, isConnected } = integration;

  return (
    <div className="w-full rounded-lg border bg-white p-4 shadow-md">
      <div className="flex flex-col gap-y-12">
        <div className="flex items-center justify-between">
          <Image
            src={image}
            alt={`${name} Logo`}
            width={64}
            height={64}
            className="flex h-16 items-center justify-center rounded-md border-2 p-2"
          />
          <Button
            size="sm"
            variant="outline"
            loading={isPending}
            onClick={() => onClickAction(integration)}
            className={cn("border-2", {
              "border-red-500 text-red-500 hover:bg-red-500 hover:text-white":
                isConnected,
            })}
          >
            {isConnected ? "Disconnect" : "Connect"}
          </Button>
        </div>

        <div className="flex flex-col gap-y-1">
          <h2 className="inline-flex items-center gap-x-4 font-medium text-gray-900 text-lg">
            {name}
            <Badge variant={isConnected ? "success" : "muted"}>
              {isConnected ? "Connected" : "Inactive"}
            </Badge>
          </h2>
          <p className="text-gray-500 text-sm">
            {IntegrationCategoryValueMap[category]}
          </p>
        </div>
      </div>
    </div>
  );
}
