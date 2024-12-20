"use client";
import { Search } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/app/_components/ui/command";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";

import { type ElementType, useEffect, useState } from "react";

import {
  DocumentAttachmentIcon,
  FileValidationIcon,
  PolicyIcon,
} from "hugeicons-react";
import { api } from "~/trpc/react";
import { Tabs, TabsList, TabsTrigger } from "~/app/_components/ui/tabs";
import Link from "next/link";
import { data as policiesList } from "~/containers/policies";

type CommandItem = {
  title: string;
  label?: string;
  pathName?: string;
  icon: ElementType;
  // variant: "white" | "ghost" | "default"; // Adjust to the allowed values
  onClick?: () => void;
};

interface SearchCenterItem {
  groupName: string;
  items: CommandItem[];
}

export function SearchCenter() {
  const [controls] = api.controls.get.useSuspenseQuery();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  // const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const [groupFilter, setGroupFilter] = useState<string>("");

  const [searchData, setSearchData] = useState<Array<SearchCenterItem>>([]);

  const menuList: SearchCenterItem[] = [
    {
      groupName: "Documents",
      items: [
        {
          title: "Document",
          icon: DocumentAttachmentIcon,
          pathName: "compliance-guide",
        },
      ],
    },
    {
      groupName: "Policies",
      items: policiesList.map((policy) => ({
        title: policy.name,
        icon: PolicyIcon,
        pathName: `policies/${policy.name.split(" ").join("-").toLowerCase()}`,
      })),
    },
    {
      groupName: "Controls",
      items: controls.map((control) => ({
        title: control.name,
        icon: FileValidationIcon,
        pathName: "controls",
      })),
    },
  ];

  const handleFilterSearchGroups = async () => {
    const filteredMenuList = groupFilter
      ? menuList.filter((menu) => menu.groupName === groupFilter)
      : menuList;

    setSearchData(filteredMenuList);
    // setTotal(total);
    // console.log(groupFilter);
  };

  useEffect(() => {
    handleFilterSearchGroups();
  }, [groupFilter]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex justify-start bg-gray-100 w-56 mx-auto rounded-lg items-center gap-2"
        >
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <span>Search...</span>
        </Button>
      </DialogTrigger>
      <DialogOverlay
        style={{
          background: "none",
          backdropFilter: "none",
          opacity: 1,
          boxShadow: "none",
        }}
        className="fixed inset-0 overlay-clear"
      />
      <DialogContent className="px-0 py-0">
        <DialogHeader className="my-2 px-4 pt-4">
          <DialogTitle>Search center</DialogTitle>
        </DialogHeader>
        <Command className=" md:min-w-[450px]">
          <CommandInput placeholder="Search for anything..." />
          <div className="my-2 border border-x-0">
            <Tabs
              defaultValue="All"
              className="w-[100px]"
              onValueChange={(value) =>
                setGroupFilter(value === "All" ? "" : value)
              }
            >
              <TabsList>
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value={"Documents"}>Documents</TabsTrigger>
                <TabsTrigger value={"Policies"}>Policies</TabsTrigger>
                <TabsTrigger value={"Controls"}>Controls</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {searchData.map((menu, idx) => (
              <CommandGroup key={idx} heading={menu.groupName}>
                {menu.items.map((item, idx) => {
                  const Icon: ElementType = item.icon;
                  return (
                    <Link
                      href={`/${item.pathName}`}
                      className="cursor-pointer"
                      onClick={handleClose}
                      key={idx}
                    >
                      <CommandItem className="px-4">
                        <Icon className="mr-2" />
                        <span>{item.title}</span>
                      </CommandItem>
                    </Link>
                  );
                })}
                <CommandSeparator />
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
