"use client";

import { HelpSquareIcon, Search01Icon } from "hugeicons-react";
import { useSession } from "next-auth/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/_components/ui/avatar";
import { Input } from "~/app/_components/ui/input";
import { Separator } from "~/app/_components/ui/seperator";
import BreadCrumbs from "./breadcrumbs";

export default function Header() {
  const { data } = useSession();

  const user = data?.user; // Safely extract user object

  return (
    <header className="w-[calc(100vw-250px)] border-b-2 px-4 py-2 [@media(min-width:1400px)]:w-[calc(100vw-280px)] [@media(min-width:1400px)]:px-6 [@media(min-width:1400px)]:py-4 ">
      <nav className="flex items-center">
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            {/* <Input
              placeholder="Search for anything..."
              className="w-72 bg-[#F9F9FB]"
              suffix={
                <span className="cursor-pointer">
                  <Search01Icon size="12" />
                </span>
              }
            /> */}
            <BreadCrumbs />

            <span className="flex items-center gap-2">
              <span className="mr-0 text-gray-500">
                <HelpSquareIcon />
              </span>
              <Separator orientation="vertical" className="mx-1 2xl:mx-2" />
              <Avatar className="h-7 w-7 rounded-xs">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback>
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                    : "?"}
                </AvatarFallback>
              </Avatar>
              <span className="flex flex-col">
                <span className="text-[#80828D] text-sm">
                  {user?.name || "Guest"}
                </span>
                <span className="text-[#B9BBC6] text-xs">{user?.email}</span>
              </span>
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
}
