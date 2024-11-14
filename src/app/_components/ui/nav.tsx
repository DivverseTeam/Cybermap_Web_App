"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "~/app/_components/ui/button";
("~/app/_components/ui/button");

import { usePathname } from "next/navigation";
import { type ElementType, MouseEvent, type ReactNode } from "react";
import { cn } from "~/lib/utils";

interface LinkProp {
  // title: string;
  // label?: string;
  // icon?: ElementType; // Icon as a React element
  // onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void; // Typing for onClick event handler
  // variant?: "default" | "ghost" | "lightBlue";
  // href?: string | undefined;
  title: string;
  label?: string;
  href?: string;
  icon?: ElementType;
  variant: "lightBlue" | "ghost" | "default"; // Adjust to the allowed values
  onClick?: () => void;
}
interface NavProps {
  isCollapsed: boolean;
  links: LinkProp[];
  groupName: string;
}

export function Nav({ links, groupName, isCollapsed }: NavProps) {
  const pathname = usePathname();

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-2 py-2 data-[collapsed=true]:py-2 text-xs xl:text-sm text-[#80828D] "
    >
      {!["home", "actions"].includes(groupName.toLocaleLowerCase()) && (
        <span className="uppercase font-[500] text-[#B9BBC6] text-sm mt-[-20px] [@media(min-width:1400px)]:mt-[-10px]">
          {groupName}
        </span>
      )}
      {groupName.toLocaleLowerCase() === "actions" && (
        <div className="mt-1 [@media(min-width:1400px)]:mt-8 2xl:mt-11"></div>
      )}
      <nav className=" grid mx-auto gap-[1px] [@media(min-width:1400px)]:gap-1 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link: LinkProp, index) => {
          let isActive = false;

          if (link.href === "/dashboard") {
            isActive = pathname === "/dashboard"; // Only active if exactly on /dashboard
          } else {
            // For other routes like /dashboard/frameworks and /settings
            isActive = pathname.startsWith(link.href!);
          }
          return (
            <div className="flex items-center relative" key={index}>
              {isActive && (
                <div className="absolute right-[221px] [@media(min-width:1400px)]:right-[245px] h-7 [@media(min-width:1400px)]:h-9 w-1 rounded-md bg-primary 2xl:w-1.5"></div>
              )}
              <div className="flex items-center">
                <Link
                  key={index}
                  href={`${link.href}`}
                  className={cn(
                    "w-[200px] [@media(min-width:1400px)]:w-[220px]",
                    isActive && "text-black",
                    buttonVariants({
                      variant: isActive ? "lightBlue" : "ghost",
                      size: "linkSm",
                    }),
                    link.variant === "default" &&
                      "dark:bg-muted dark:text-white dark:hover:bg-muted  dark:hover:text-white",
                    link.variant === "lightBlue" && "text-black",
                    "justify-start"
                  )}
                >
                  {link.icon && (
                    <link.icon
                      className={`${
                        isActive && "text-primary"
                      } "mr-2 pr-2 h-4 w-4"`}
                    />
                  )}
                  {link.title}
                  {link.label && (
                    <span
                      className={cn(
                        "ml-auto",
                        link.variant === "default" &&
                          "text-background dark:text-white"
                      )}
                    >
                      {link.label}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
