import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Search01Icon } from "hugeicons-react";
import Image from "next/image";
import React from "react";
import { Button } from "~/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import { Input } from "~/app/_components/ui/input";
import { AvailableIntegrationCard } from "./available-integration-card";
import type { Integration } from "~/lib/types/integrations";

type Props = {
  integrations?: Array<Integration>;
};

export default function AvailableIntegrationsContainer({
  integrations,
}: Props) {
  return (
    <div className="flex grow flex-col">
      <div className="mx-auto flex w-full justify-between rounded-2xl rounded-b-none border bg-muted p-4 2xl:p-5">
        <Input
          type="text"
          placeholder="Search for available integrations"
          // onChange={handleSearch}
          // defaultValue={search}
          className="w-72 rounded-md bg-[#F9F9FB]"
          suffix={
            <span className="cursor-pointer">
              <Search01Icon size="12" />
            </span>
          }
        />
      </div>
      <div className="border bg-white px-3 py-4 2xl:px-8 2xl:py-9 [@media(min-width:1400px)]:px-5 [@media(min-width:1400px)]:py-8">
        <div className="mb-4 [@media(min-width:1400px)]:mb-6">
          <h2 className="font-semibold text-lg [@media(min-width:1400px)]:text-xl">
            All integrations
          </h2>
          <p className="text-gray-600 text-xs [@media(min-width:1400px)]:text-sm">
            Go through and access all available integrations in here
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1400px)]:gap-4">
          {integrations?.map((integration, index: number) => (
            <AvailableIntegrationCard key={index} integration={integration} />
          ))}
        </div>
      </div>
    </div>
  );
}
