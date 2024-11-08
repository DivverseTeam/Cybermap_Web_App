"use client";

import { HelpSquareIcon, Search01Icon } from "hugeicons-react";
import { useSession } from "next-auth/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/_components/ui/avatar";
import { Input } from "~/app/_components/ui/input";
import { CyberMapBrand } from "../svgs/CyberMapBrand";
import { SeparatorVerticalIcon } from "lucide-react";
import { Separator } from "~/app/_components/ui/seperator";

export default function Header() {
  const { data } = useSession();
  return (
    <header className="fixed inset-x-0 top-0 ml-[280px] z-10 w-[calc(100vw-280px)] border-b-2 border-b-[#E8E8EC] bg-white px-4 py-2 [@media(min-width:1300px)]:px-6 [@media(min-width:1300px)]:py-4">
      <nav className="flex items-center">
        {/* <div className="w-64 px-3">
					<CyberMapBrand />
				</div> */}

        <div className="flex-grow">
          <div className="flex justify-between">
            <Input
              placeholder="Search for anything..."
              className="bg-[#F9F9FB] w-72"
              suffix={
                <span className="cursor-pointer">
                  <Search01Icon size="12" />
                </span>
              }
            />

            <span className="flex items-center gap-2">
              {" "}
              <span className="mr-0 text-gray-500">
                <HelpSquareIcon />
              </span>
              <Separator orientation="vertical" className="mx-1 2xl:mx-2" />
              <Avatar className="h-7 w-7 rounded-xs">
                <AvatarImage src="" />
                <AvatarFallback>TU</AvatarFallback>
              </Avatar>
              <span className="flex flex-col">
                <span className="text-[#80828D] text-sm">
                  {data?.user.name}
                </span>
                <span className="text-[#B9BBC6] text-xs">
                  {data?.user?.email}
                </span>
              </span>
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
}
