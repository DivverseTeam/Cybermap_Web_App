"use client";

import { PlusSignIcon, Search01Icon } from "hugeicons-react";
import { EllipsisVertical, Trash2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DataTable } from "~/app/_components/table/data-table";
import { Badge } from "~/app/_components/ui/badge";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { Separator } from "~/app/_components/ui/seperator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/_components/ui/tabs";
import { columns } from "~/containers/controls/components/control-table-columns";
import type { OrganisationControl } from "~/lib/types/controls";
import { api } from "~/trpc/react";

type Props = {};

export default function IntegrationProfile({}: Props) {
  // List of available 3rd party integrations
  const [{ all: allIntegrations }] = api.integrations.get.useSuspenseQuery();
  const params = useParams();
  const integrationSlug = params.slug as string;

  //   Controls list
  const [controls] = api.controls.get.useSuspenseQuery();

  const [tableData, setTableData] = useState<Array<OrganisationControl>>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const integration = allIntegrations.find(
    (integration) => integration.name.split(" ").join("-") === integrationSlug
  );

  if (!integration) {
    return (
      <div className="px-4 [@media(min-width:1400px)]:px-6 ">
        Integration not found
      </div>
    );
  }

  const { name, image, isConnected } = integration;

  const handleFilterUserControlMapping = async () => {
    const filteredData = statusFilter
      ? controls.filter((control) => control.status === statusFilter)
      : controls;

    setTableData(filteredData);
    // setTotal(total);
    console.log(statusFilter);
  };

  useEffect(() => {
    handleFilterUserControlMapping();
  }, [statusFilter, controls]);

  return (
    <div className="flex flex-col gap-6 [@media(min-width:1400px)]:gap-10 px-4 [@media(min-width:1400px)]:px-6 ">
      {/* Name */}
      <div className="flex items-center gap-4">
        <Image
          src={image}
          alt={`${name} logo`}
          width={45}
          height={45}
          className="border rounded-md p-1"
        />
        <h3 className="font-semibold">{name}</h3>
      </div>

      {/* Summary */}
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div className="flex flex-col gap-1 items-center">
          <h3>Status</h3>
          <Badge variant={`${isConnected ? "success" : "destructive"}`}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
        <Separator className="h-10" orientation="vertical" />
        <div className="flex flex-col items-center">
          <h3>Connections</h3>
          <span>3</span>
        </div>
        <Separator className="h-10" orientation="vertical" />
        <div className="flex flex-col items-center">
          <h3>Controls</h3>
          <span>{controls.length}</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="settings" className="flex flex-col items-start gap-5">
        <TabsList className="rounded-none bg-inherit border-b-2 w-full flex justify-start">
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        {/* Controls tab */}
        <TabsContent value="controls" className="w-full p-4">
          <div className="bg-gray-100 p-1 h-full w-full rounded-lg border border-neutral-2 border-solid">
            <div className="container flex flex-col gap-4 bg-white p-3 py-4 [@media(min-width:1400px)]:gap-6 [@media(min-width:1400px)]:p-4 [@media(min-width:1400px)]:py-6 rounded-lg h-max shadow-md">
              <div className="flex justify-between">
                <div>
                  <Tabs
                    defaultValue="All"
                    className="w-[100px]"
                    onValueChange={(value) =>
                      setStatusFilter(value === "All" ? "" : value)
                    }
                  >
                    <TabsList>
                      <TabsTrigger value="All">All</TabsTrigger>
                      <TabsTrigger value={"PARTIALLY_IMPLEMENTED"}>
                        Partially implemented
                      </TabsTrigger>
                      <TabsTrigger value={"FULLY_IMPLEMENTED"}>
                        Fully implemented
                      </TabsTrigger>
                      <TabsTrigger value={"NOT_IMPLEMENTED"}>
                        Not implemented
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <Input
                  type="text"
                  placeholder="Search for a control"
                  // onChange={handleSearch}
                  // defaultValue={search}
                  className="w-54 bg-[#F9F9FB] [@media(min-width:1400px)]:w-72"
                  suffix={
                    <span className="cursor-pointer">
                      <Search01Icon size="12" />
                    </span>
                  }
                />
              </div>

              <DataTable columns={columns} data={tableData} />
            </div>
          </div>
        </TabsContent>

        {/* settins tab */}
        <TabsContent
          value="settings"
          className="w-full text-lg flex flex-col text-secondary"
        >
          <div className="flex justify-between mx-14 py-6">
            <h1 className="w-1/3 font-semibold text-black">Connections</h1>

            <div className="flex flex-col gap-4 w-2/3">
              <div className="flex flex-col">
                <h1 className="font-semibold text-black">Active connections</h1>
                <p>Display and manage the active connections</p>
              </div>
              {/* list of connections */}
              <div className="flex flex-col gap-2">
                {/* single connection */}
                <div className="flex items-center justify-between border rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <p className="text-black text-md">GCS-Secure-Buckets</p>
                    <Badge variant="success">Connected</Badge>
                  </div>
                  <EllipsisVertical />
                </div>
                {/* add connection button */}
                <Button
                  variant="outline"
                  className="h-9 w-44 flex [@media(min-width:1400px)]:h-10 rounded-2xl text-black"
                  //   size="sm"
                >
                  <PlusSignIcon className="mr-2 w-4" />
                  Add connection
                </Button>
              </div>
            </div>
          </div>
          <Separator className="w-full" orientation="horizontal" />
          <div className="flex justify-between mx-14 py-6">
            <h1 className="w-1/3 font-semibold text-black">Danger zone</h1>
            <div className="flex flex-col gap-4 w-2/3">
              <div className="flex flex-col">
                <h1 className="font-semibold text-black">Active connections</h1>
                <p>
                  Removing this integration will delete all associated assets
                  and data
                </p>
              </div>
              <Badge
                variant={"destructive"}
                className="flex items-center gap-1 rounded-xl  h-10 w-40"
              >
                <Trash2 className="text-white w-4" />
                <span>Remove integration</span>
              </Badge>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
