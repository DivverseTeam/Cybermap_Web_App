"use client";

import React, { type ReactNode } from "react";
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

import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Nav } from "~/app/_components/ui/nav";
import { CyberMapBrand } from "~/components/svgs/CyberMapBrand";

type Props = {};

interface SidebarMenuItem {
	groupName: string;
	items: {
		title: string;
		href?: string;
		icon?: ReactNode;
		variant: string;
		onClick?: () => void;
	};
}

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
					onClick: { onLogout },
					href: "/signin",
				},
			],
		},
	];

	return (
		<aside className="fixed top-0 left-0 flex min-h-screen min-w-[280px] flex-grow flex-col justify-start border text-[14px] leading-4">
			<div className="border-b px-6 py-6 ">
				<CyberMapBrand />
			</div>
			<div className="flex max-h-[700px] flex-grow flex-col justify-start gap-[12px] px-6 pt-20 text-[14px] leading-4 ">
				{menuList.map((menu: any, _key: any) => (
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
