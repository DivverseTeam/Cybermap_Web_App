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
  { id: 1, name: "AWS", icon: "/integrations/aws.svg" },
  { id: 2, name: "Heroku", icon: "/integrations/heroku.svg" },
  { id: 3, name: "Netlify", icon: "/integrations/netlify.svg" },
  { id: 4, name: "Digital Ocean", icon: "/integrations/digitalOcean.svg" },
  { id: 5, name: "Vercel", icon: "/integrations/vercel.svg" },
  { id: 6, name: "Supabase", icon: "/integrations/supabase.svg" },
  { id: 7, name: "GCP", icon: "/integrations/gcp.svg" },
  { id: 8, name: "Azure", icon: "/integrations/azure.svg" },
  { id: 9, name: "Vercel", icon: "/integrations/vercel.svg" },
  { id: 10, name: "Supabase", icon: "/integrations/supabase.svg" },
  { id: 11, name: "GCP", icon: "/integrations/gcp.svg" },
  { id: 12, name: "Digital Ocean", icon: "/integrations/digitalOcean.svg" },
];

export default function ConnectedIntegrationsContainer({}: Props) {
  return (
    <div className="flex flex-col grow">
      <div className="flex justify-between p-4 rounded-2xl rounded-b-none border w-full mx-auto">
        <Input
          type="text"
          placeholder="Search for available integrations"
          // onChange={handleSearch}
          // defaultValue={search}
          className="bg-[#F9F9FB] w-72 rounded-md"
          suffix={
            <span className="cursor-pointer">
              <Search01Icon size="12" />
            </span>
          }
        />
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted mx-auto"
              >
                <DotsHorizontalIcon
                  className="size-4 font-bold text-secondary"
                  aria-hidden="true"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
              // onSelect={() => setShowUpdateEvidenceSheet(true)}
              >
                View
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
              // onSelect={() => setShowDeleteEvidenceDialog(true)}
              >
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="px-5 py-8 border">
        <div className=" mb-6">
          <h2 className="text-xl font-semibold">All integrations</h2>
          <p className="text-gray-600 text-sm">
            Go through and access all available integrations in here
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {integrationsList.map((integration, index: any) => (
            <ConnectedIntegrationCard key={index} integration={integration} />
          ))}
        </div>
      </div>
    </div>
  );
}
