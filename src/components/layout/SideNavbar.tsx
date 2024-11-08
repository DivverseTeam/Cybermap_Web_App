"use client";

import React, { type ElementType, type ReactNode } from "react";
// import { Nav } from "~/app/_components/ui/nav";

import {
  Analytics01Icon,
  CurvyRightDirectionIcon,
  FrameworksIcon,
  FileValidationIcon,
  LibraryIcon,
  PolicyIcon,
  UserMultipleIcon,
  OnlineLearning01Icon,
  Audit02Icon,
  AccountSetting02Icon,
  Logout02Icon,
} from "hugeicons-react";
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
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
          title: "Starter guide",
          href: "/starter-guide",

          icon: CurvyRightDirectionIcon,
          variant: `${pathname === "/starter-guide" ? "lightBlue" : "ghost"}`,
        },
      ],
    },
    {
      groupName: "Compliance",
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
        {
          title: "Evidence Library",
          icon: LibraryIcon,
          href: "/evidence-library",
          variant: `${
            pathname === "/evidence-library" ? "lightBlue" : "ghost"
          }`,
        },
        {
          title: "Polices",
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
          title: "Personnel",
          icon: UserMultipleIcon,
          href: "/personnel",
          variant: `${pathname === "/personnel" ? "lightBlue" : "ghost"}`,
        },
        {
          title: "Integrations",
          icon: CurvyRightDirectionIcon,
          href: "/integrations",
          variant: `${pathname === "/integrations" ? "lightBlue" : "ghost"}`,
        },
        {
          title: "Training modules",
          icon: OnlineLearning01Icon,
          href: "/training-modules",
          variant: `${
            pathname === "/training-modules" ? "lightBlue" : "ghost"
          }`,
        },
        {
          title: "Audit center",
          icon: Audit02Icon,
          href: "/audit-center",
          variant: `${pathname === "/audit-center" ? "lightBlue" : "ghost"}`,
        },
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
          href: "/signin",
        },
      ],
    },
  ];

  return (
    <aside
      className="fixed bg-[#F9F9FB] z-20 top-0 left-0 border min-w-[280px] text-[14px] leading-4  
    flex flex-col justify-start flex-grow min-h-screen"
    >
      <div className="border-b py-4 px-4  [@media(min-width:1400px)]:py-6 [@media(min-width:1400px)]:px-6 ">
        <CyberMapBrand />
      </div>
      <div className="text-[14px] leading-4  flex flex-col justify-start flex-grow pt-12 [@media(min-width:1400px)]:pt-20 gap-[12px] max-h-[700px] px-4 [@media(min-width:1400px)]:px-6 ">
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
