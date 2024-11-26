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
import { CyberMapBrand } from "~/components/svgs/CyberMapBrand";

type Props = {};

type MenuItem = {
  title: string;
  label?: string;
  href?: string;
  icon?: ElementType;
  variant: "lightBlue" | "ghost" | "default"; // Adjust to the allowed values
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
          variant: `${pathname === "/dashboard" ? "lightBlue" : "ghost"}`,
        },
        {
          title: "Compliance guide",
          href: "/starter-guide",

          icon: CurvyRightDirectionIcon,
          variant: `${pathname === "/starter-guide" ? "lightBlue" : "ghost"}`,
        },
      ],
    },
    {
      groupName: "Governance",
      items: [
        {
          title: "Frameworks",
          icon: FrameworksIcon,
          href: "/frameworks",
          variant: `${pathname === "/frameworks" ? "lightBlue" : "ghost"}`,
        },
        {
          title: "Controls",
          icon: FileValidationIcon,
          href: "/controls",
          variant: `${pathname === "/controls" ? "lightBlue" : "ghost"}`,
        },
        // {
        //   title: "Regulations",
        //   icon: PolicyIcon,
        //   href: "/regulations",
        //   variant: `${pathname === "/regulations" ? "lightBlue" : "ghost"}`,
        // },
        {
          title: "Evidence library",
          icon: LibraryIcon,
          href: "/evidence-library",
          variant: `${
            pathname === "/evidence-library" ? "lightBlue" : "ghost"
          }`,
        },
        {
          title: "Policies",
          icon: PolicyIcon,
          href: "/policies",
          variant: `${pathname === "/policies" ? "lightBlue" : "ghost"}`,
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
          variant: `${pathname === "/employees" ? "lightBlue" : "ghost"}`,
        },
        {
          title: "Integrations",
          icon: CurvyRightDirectionIcon,
          href: "/integrations",
          variant: `${pathname === "/integrations" ? "lightBlue" : "ghost"}`,
        },
        // {
        //   title: "Training modules",
        //   icon: OnlineLearning01Icon,
        //   href: "/training-modules",
        //   variant: `${
        //     pathname === "/training-modules" ? "lightBlue" : "ghost"
        //   }`,
        // },
        // {
        //   title: "Audit center",
        //   icon: Audit02Icon,
        //   href: "/audit-center",
        //   variant: `${pathname === "/audit-center" ? "lightBlue" : "ghost"}`,
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

          variant: `${pathname === "/settings" ? "lightBlue" : "ghost"}`,
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
    <aside className="fixed top-0 left-0 z-20 flex h-screen w-[250px] flex-grow flex-col justify-start overflow-y-auto bg-[#192839] text-[14px] leading-4 [@media(min-width:1400px)]:w-[280px] [@media(min-width:1400px)]:min-w-[280px]">
      <div className="mx-auto flex w-full items-center justify-center px-4 py-3 [@media(min-width:1400px)]:px-6 [@media(min-width:1400px)]:py-6 ">
        <CyberMapBrand />
      </div>
      <div className="flex max-h-[700px] flex-grow flex-col justify-start gap-[12px] px-4 pt-12 text-[14px] leading-4 [@media(min-width:1400px)]:px-6 [@media(min-width:1400px)]:pt-20 ">
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
