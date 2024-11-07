"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

import { buttonVariants } from "~/app/_components/ui/button";
("~/app/_components/ui/button");

import { cn } from "~/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/app/_components/ui/tooltip";
import { usePathname } from "next/navigation";
import { MouseEvent, ElementType } from "react";
import path from "path";

interface LinkProp {
  title: string;
  label?: string;
  icon?: ElementType; // Icon as a React element
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void; // Typing for onClick event handler
  variant?: "default" | "ghost" | "lightBlue";
  href?: string | undefined;
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
      className="group flex flex-col gap-2 py-2 data-[collapsed=true]:py-2 text-sm text-[#80828D] "
    >
      {!["home", "actions"].includes(groupName.toLocaleLowerCase()) && (
        <span className="uppercase font-[500] text-[#B9BBC6] text-sm mt-[-10px]">
          {groupName}
        </span>
      )}
      {groupName.toLocaleLowerCase() === "actions" && (
        <div className="mt-8 2xl:mt-11"></div>
      )}
      <nav className=" grid gap-1 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
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
                <div className="h-9 w-1 2xl:w-1.5 rounded-md absolute left-[-25] bg-primary"></div>
              )}
              <Link
                key={index}
                href={`${link.href}`}
                className={cn(
                  "w-[220px]",
                  isActive && "text-black",
                  buttonVariants({
                    variant: isActive ? "lightBlue" : "ghost",
                    size: "sm",
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
          );
        })}
      </nav>
    </div>
  );
}
