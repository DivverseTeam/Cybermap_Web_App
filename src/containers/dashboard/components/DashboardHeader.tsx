"use client";

import { HelpSquareIcon, Search01Icon } from "hugeicons-react";
import { useSession } from "next-auth/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/_components/ui/avatar";
import { Input } from "~/app/_components/ui/input";

export default function DashboardHeader() {
  const { data } = useSession();
  return (
    <header className="sticky inset-x-0 top-0 z-10 w-full border-b-2 border-b-[#E8E8EC] bg-white px-6 py-4">
      <nav className="flex items-center">
        <div className="flex flex-grow justify-between gap-3">
          <div className="flex w-full items-center justify-between border-r-2">
            <Input
              placeholder="Search for anything..."
              className="w-72 bg-[#F9F9FB]"
              suffix={
                <span className="cursor-pointer">
                  <Search01Icon size="12" />
                </span>
              }
            />
            <span className="mr-4 text-gray-500">
              <HelpSquareIcon />
            </span>
          </div>
          <span className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback>TU</AvatarFallback>
            </Avatar>
            <span className="flex flex-col">
              <span className="text-[#80828D] text-sm">{data?.user.name}</span>
              <span className="text-[#B9BBC6] text-xs">
                {data?.user?.email}
              </span>
            </span>
          </span>
        </div>
      </nav>
    </header>
  );
}
