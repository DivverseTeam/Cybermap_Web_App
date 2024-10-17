"use client";

import React from "react";
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

export default function SideNavbar({}: Props) {
  const onLogout = () => {
    signOut({
      callbackUrl: "/signin",
    });
  };

  const pathname = usePathname();

  const menuList = [
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
          href: "/dashboard/starter-guide",

          icon: CurvyRightDirectionIcon,
          variant: `${
            pathname === "/dashboard/starter-guide" ? "lightBlue" : "ghost"
          }`,
        },
      ],
    },
    {
      groupName: "Compliance",
      items: [
        {
          title: "Frameworks",
          icon: FrameworksIcon,
          href: "/dashboard/frameworks",
          variant: `${
            pathname === "/dashboard/frameworks" ? "lightBlue" : "ghost"
          }`,
        },
        {
          title: "Controls",
          icon: FileValidationIcon,
          href: "/dashboard/controls",
          variant: `${
            pathname === "/dashboard/controls" ? "lightBlue" : "ghost"
          }`,
        },
        {
          title: "Evidence Library",
          icon: LibraryIcon,
          href: "/dashboard/evidence-library",
          variant: `${
            pathname === "/dashboard/evidence-library" ? "lightBlue" : "ghost"
          }`,
        },
        {
          title: "Polices",
          icon: PolicyIcon,
          href: "/dashboard/policies",
          variant: `${
            pathname === "/dashboard/policies" ? "lightBlue" : "ghost"
          }`,
        },
      ],
    },
    {
      groupName: "Management",
      items: [
        {
          title: "Personnel",
          icon: UserMultipleIcon,
          href: "/dashboard/personnel",
          variant: `${
            pathname === "/dashboard/personnel" ? "lightBlue" : "ghost"
          }`,
        },
        {
          title: "Integrations",
          icon: CurvyRightDirectionIcon,
          href: "/dashboard/integrations",
          variant: `${
            pathname === "/dashboard/integrations" ? "lightBlue" : "ghost"
          }`,
        },
        {
          title: "Training modules",
          icon: OnlineLearning01Icon,
          href: "/dashboard/training-modules",
          variant: `${
            pathname === "/dashboard/training-modules" ? "lightBlue" : "ghost"
          }`,
        },
        {
          title: "Audit center",
          icon: Audit02Icon,
          href: "/dashboard/audit-center",
          variant: `${
            pathname === "/dashboard/audit-center" ? "lightBlue" : "ghost"
          }`,
        },
      ],
    },
    {
      groupName: "Actions",
      items: [
        {
          title: "Settings",
          icon: AccountSetting02Icon,
          href: "/dashboard/settings",

          variant: `${
            pathname === "/dashboard/settings" ? "lightBlue" : "ghost"
          }`,
        },
        {
          title: "Logout",
          icon: Logout02Icon,
          variant: "ghost",
          onClick: { onLogout },
        },
      ],
    },
  ];

  return (
    <div className=" border min-w-[280px] text-[14px] leading-4  flex flex-col justify-start flex-grow min-h-screen">
      <div className="border-b  py-6 px-6 ">
        <CyberMapBrand />
      </div>
      <div className="text-[14px] leading-4  flex flex-col justify-between flex-grow pt-20 gap-[16px] max-h-[700px] px-6 ">
        {menuList.map((menu: any, key: any) => (
          <Nav
            isCollapsed={false}
            key={menu.groupName}
            groupName={menu.groupName}
            links={menu.items}
          />
        ))}
      </div>
    </div>
  );
}
