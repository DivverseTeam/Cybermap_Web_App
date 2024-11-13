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
import { ConnectedIntegrationCard } from "./connected-integration-card";
// import { IntegrationCard } from "./available-integration-card";

type Props = {};

const integrationsList = [
  { id: "1", name: "Github", icon: "/integrations/githubLogo.png" },
  {
    id: "2",
    name: "Github Enterprise Server",
    icon: "/integrations/githubLogo.png",
  },
  { id: "3", name: "Gitlab", icon: "/integrations/gitlabLogo.png" },
  { id: "4", name: "GCP", icon: "/integrations/gcpLogo.png" },
  {
    id: "5",
    name: "Digital Ocean",
    icon: "/integrations/digitalOceanLogo.png",
  },
  { id: "6", name: "Vercel", icon: "/integrations/vercelLogo.png" },
  { id: "7", name: "Supabase", icon: "/integrations/supabaseLogo.png" },
  { id: "8", name: "GCP", icon: "/integrations/gcpLogo.png" },
  { id: "9", name: "Vercel", icon: "/integrations/vercelLogo.png" },
  { id: "10", name: "Supabase", icon: "/integrations/supabaseLogo.png" },
  { id: "11", name: "GCP", icon: "/integrations/gcpLogo.png" },
  {
    id: "12",
    name: "Digital Ocean",
    icon: "/integrations/digitalOceanLogo.png",
  },
];

export default function ConnectedIntegrationsContainer({}: Props) {
  return (
    <div className="flex grow flex-col">
      <div className="mx-auto flex w-full justify-between rounded-2xl rounded-b-none border bg-muted p-2 [@media(min-width:1400px)]:p-4 2xl:p-5">
        <Input
          type="text"
          placeholder="Search for connected integrations"
          // onChange={handleSearch}
          // defaultValue={search}
          className="w-60 [@media(min-width:1400px)]:w-72 rounded-md bg-[#F9F9FB]"
          suffix={
            <span className="cursor-pointer">
              <Search01Icon size="12" />
            </span>
          }
        />
      </div>
      <div className="border bg-white px-3 py-4 [@media(min-width:1400px)]:px-5 [@media(min-width:1400px)]:py-8 2xl:px-8 2xl:py-9">
        <div className="mb-4 [@media(min-width:1400px)]:mb-6">
          <h2 className="font-semibold text-lg [@media(min-width:1400px)]:text-xl">
            Connected integrations
          </h2>
          <p className="text-gray-600 text-xs [@media(min-width:1400px)]:text-sm">
            Go through and access connected integrations in here
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {integrationsList.map((integration, index: number) => (
            <ConnectedIntegrationCard key={index} integration={integration} />
          ))}
        </div>
      </div>
    </div>
  );
}
