"use client";

import { type ReactNode, useState } from "react";
import { cn } from "~/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountSetting02Icon, Logout02Icon } from "hugeicons-react";
import React from "react";
import { signOut } from "next-auth/react";

export interface SidebarNavProps {
	items: SidebarNavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
	const onLogout = () => {
		signOut({
			callbackUrl: "/signin",
		});
	};

	const pathname = usePathname();

	return items.length ? (
		<aside
			id="sidebar"
			className="-translate-x-full fixed top-0 left-0 h-screen w-64 border-slate-200 border-r transition-transform sm:translate-x-0 dark:border-slate-700"
			aria-label="Sidebar"
		>
			<div className="mt-24 flex h-full flex-col overflow-y-auto px-3 py-4">
				<ul className="space-y-3 text-sm">
					{items.map((item, index) => (
						<SidebarMenuItem key={index} item={item} pathname={pathname} />
					))}

					<SidebarMenuItem
						key="settings"
						item={{
							title: "Settings",
							href: "/settings",
							icon: <AccountSetting02Icon />,
						}}
						pathname={pathname}
						className="fixed bottom-32 w-11/12"
					/>
					<SidebarMenuItem
						key="logout"
						item={{
							title: "Logout",
							icon: <Logout02Icon />,
						}}
						pathname={pathname}
						className="fixed bottom-20 w-11/12"
						onClick={onLogout}
					/>
				</ul>
			</div>
		</aside>
	) : null;
}

export type SidebarNavItem = {
	title: string;
	icon?: ReactNode;
	external?: boolean;
	disabled?: boolean;
} & (
	| {
			href?: string;
			submenu?: never;
	  }
	| {
			href?: string;
			submenu: SidebarNavItem[];
	  }
);

interface SidebarMenuItemProps {
	item: SidebarNavItem;
	pathname: string | null;
	className?: string;
	onClick?: () => void;
}

export function SidebarMenuItem({
	item,
	pathname,
	className,
	onClick,
}: SidebarMenuItemProps) {
	const [isSubmenuOpen, setSubmenuOpen] = useState(true);

	const toggleSubmenu = () => {
		setSubmenuOpen(!isSubmenuOpen);
	};

	const WrapperComponent = !item.disabled && item.href ? Link : "span"; // Use Link if href is defined

	const isCurrentPath = item.href && pathname?.includes(item.href);

	return (
		<li
			className={cn("relative", {
				"flex items-center": !item.submenu?.length,
			})}
		>
			{isCurrentPath ? (
				<div className="absolute left-[-12] h-8 w-1 bg-primary"></div>
			) : null}

			<WrapperComponent
				href={item?.href || ""}
				className={cn(
					"flex w-full items-center rounded-lg px-3 py-2 text-slate-600 hover:bg-[#0047F112] dark:text-white dark:hover:bg-slate-700",
					{
						"bg-[#0047F112]": isCurrentPath,
						"-ml-8 mt-2 cursor-pointer text-xs": item.submenu?.length,
						"cursor-pointer": item.submenu?.length || onClick,
					},
					className,
				)}
				target={item.external ? "_blank" : ""}
				rel={item.external ? "noreferrer" : ""}
				onClick={
					item.submenu?.length ? toggleSubmenu : onClick ? onClick : undefined
				}
			>
				<span
					className={cn("text-xs", {
						"text-[#305EFF]": isCurrentPath,
					})}
				>
					{item?.icon || null}
				</span>
				<span
					className={cn("ml-3 flex-1 whitespace-nowrap", {
						"ml-9": !item.icon,
					})}
				>
					{item.title}
				</span>
				{/* {item.submenu?.length ? (
					<ChevronDown
						className={cn("ml-2", {
							"rotate-180 transform": isSubmenuOpen,
						})}
					/>
				) : null} */}
			</WrapperComponent>

			{item.submenu?.length && isSubmenuOpen && (
				<ul className="top-0 ml-3 space-y-3">
					{item.submenu.map((subMenuItem, index) => (
						<SidebarMenuItem
							key={index}
							item={subMenuItem}
							pathname={pathname}
						/>
					))}
				</ul>
			)}
		</li>
	);
}
