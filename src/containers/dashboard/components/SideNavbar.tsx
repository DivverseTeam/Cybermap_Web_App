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
          href: "/",

          icon: Analytics01Icon,
          variant: "default",
        },
        {
          title: "Starter guide",
          href: "/starter-guide",

          icon: CurvyRightDirectionIcon,
          variant: "ghost",
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
          variant: "ghost",
        },
        {
          title: "Controls",
          icon: FileValidationIcon,
          href: "/controls",
          variant: "ghost",
        },
        {
          title: "Evidence Library",
          icon: LibraryIcon,
          href: "/evidence-library",
          variant: "ghost",
        },
        {
          title: "Polices",
          icon: PolicyIcon,
          href: "/policies",
          variant: "ghost",
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
          variant: "ghost",
        },
        {
          title: "Integration",
          icon: CurvyRightDirectionIcon,
          href: "/integration",
          variant: "ghost",
        },
        {
          title: "Training modules",
          icon: OnlineLearning01Icon,
          href: "/training-modules",
          variant: "ghost",
        },
        {
          title: "Audit center",
          icon: Audit02Icon,
          href: "/audit-center",
          variant: "ghost",
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

          variant: "ghost",
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
    <div className="border">
      {menuList.map((menu: any, key: any) => (
        <Nav
          isCollapsed={false}
          key={menu.groupName}
          groupName={menu.groupName}
          links={menu.items}
        />
      ))}
    </div>
  );
}
