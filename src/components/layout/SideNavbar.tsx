"use client";

import React, { type ElementType, type ReactNode } from "react";
// import { Nav } from "~/app/_components/ui/nav";

import {
  AccountSetting02Icon,
  Analytics01Icon,
  Audit02Icon,
  CurvyRightDirectionIcon,
  FileValidationIcon,
  FrameworksIcon,
  LibraryIcon,
  Logout02Icon,
  OnlineLearning01Icon,
  PolicyIcon,
  UserMultipleIcon,
} from "hugeicons-react";

import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Nav } from "~/app/_components/ui/nav";
import { VerakosBrand } from "../svgs/VerakosBrand";
import { SearchCenter } from "./search-center";

type Props = {};

type MenuItem = {
  title: string;
  label?: string;
  href?: string;
  icon?: ElementType;
  variant: "white" | "ghost" | "default"; // Adjust to the allowed values
  onClick?: () => void;
};

interface SidebarMenuItem {
  groupName: string;
  items: MenuItem[];
}

export default function SideNavbar({}: Props) {
  const handleLogout = () => {
    signOut({
      callbackUrl: "/signin",
    });
  };

  const pathname = usePathname();

  const menuList: SidebarMenuItem[] = [
    {
      groupName: "Home",
      items: [
        {
          title: "Dashboard",
          href: "/dashboard",

          icon: Analytics01Icon,
          variant: `${pathname === "/dashboard" ? "white" : "ghost"}`,
        },
        {
          title: "Compliance guide",
          href: "/compliance-guide",

          icon: CurvyRightDirectionIcon,
          variant: `${pathname === "/compliance-guide" ? "white" : "ghost"}`,
        },
      ],
    },
    {
      groupName: "Governance",
      items: [
        // {
        //   title: "Frameworks",
        //   icon: FrameworksIcon,
        //   href: "/frameworks",
        //   variant: `${pathname === "/frameworks" ? "white" : "ghost"}`,
        // },
        {
          title: "Controls",
          icon: FileValidationIcon,
          href: "/controls",
          variant: `${pathname === "/controls" ? "white" : "ghost"}`,
        },
        // {
        //   title: "Regulations",
        //   icon: PolicyIcon,
        //   href: "/regulations",
        //   variant: `${pathname === "/regulations" ? "white" : "ghost"}`,
        // },
        {
          title: "Evidence library",
          icon: LibraryIcon,
          href: "/evidence-library",
          variant: `${pathname === "/evidence-library" ? "white" : "ghost"}`,
        },
        {
          title: "Policies",
          icon: PolicyIcon,
          href: "/policies",
          variant: `${pathname === "/policies" ? "white" : "ghost"}`,
        },
      ],
    },
    {
      groupName: "Management",
      items: [
        {
          title: "Employees",
          icon: UserMultipleIcon,
          href: "/employees",
          variant: `${pathname === "/employees" ? "white" : "ghost"}`,
        },
        {
          title: "Integrations",
          icon: CurvyRightDirectionIcon,
          href: "/integrations",
          variant: `${pathname === "/integrations" ? "white" : "ghost"}`,
        },
        // {
        //   title: "Training modules",
        //   icon: OnlineLearning01Icon,
        //   href: "/training-modules",
        //   variant: `${
        //     pathname === "/training-modules" ? "white" : "ghost"
        //   }`,
        // },
        // {
        //   title: "Audit center",
        //   icon: Audit02Icon,
        //   href: "/audit-center",
        //   variant: `${pathname === "/audit-center" ? "white" : "ghost"}`,
        // },
      ],
    },
    {
      groupName: "Actions",
      items: [
        {
          title: "Settings",
          icon: AccountSetting02Icon,
          href: "/settings",

          variant: `${pathname === "/settings" ? "white" : "ghost"}`,
        },
        {
          title: "Logout",
          icon: Logout02Icon,
          variant: "ghost",
          onClick: handleLogout,
        },
      ],
    },
  ];

  return (
    <aside className="fixed top-0 left-0 z-20 flex h-screen w-[246px] flex-grow flex-col justify-start overflow-y-auto bg-gray-50 text-[14px] leading-4 [@media(min-width:1400px)]:w-[280px] [@media(min-width:1400px)]:min-w-[280px]">
      <div className="mx-auto flex w-full items-center px-2 py-2 [@media(min-width:1400px)]:px-4 [@media(min-width:1400px)]:py-6 ">
        <VerakosBrand />
      </div>
      <SearchCenter />
      <div className="flex max-h-[700px] mt-2 [@media(min-width:1400px)]:mt-4 flex-grow flex-col justify-start gap-[12px] px-4  text-[14px] leading-4 [@media(min-width:1400px)]:px-6 ">
        {menuList.map((menu) => (
          <Nav
            isCollapsed={false}
            key={menu.groupName}
            groupName={menu.groupName}
            links={menu.items}
          />
        ))}
      </div>
    </aside>
  );
}
