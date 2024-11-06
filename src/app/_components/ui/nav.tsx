"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "~/app/_components/ui/button";
("~/app/_components/ui/button");

import path from "path";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/app/_components/ui/tooltip";
import { cn } from "~/lib/utils";

interface NavProps {
	isCollapsed: boolean;
	links: {
		title: string;
		label?: string;
		icon?: any;
		onClick?: any;
		variant?: "default" | "ghost";
		href?: string;
	}[];
	groupName: string;
}

export function Nav({ links, groupName, isCollapsed }: NavProps) {
	const pathname = usePathname();

	return (
		<div
			data-collapsed={isCollapsed}
			className="group flex flex-col gap-2 py-2 text-[#80828D] text-sm data-[collapsed=true]:py-2 "
		>
			{!["home", "actions"].includes(groupName.toLocaleLowerCase()) && (
				<span className="mt-[-10px] font-[500] text-[#B9BBC6] text-sm uppercase">
					{groupName}
				</span>
			)}
			<nav className=" grid gap-1 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
				{links.map((link: any, index) => {
					let isActive = false;

					if (link.href === "/dashboard") {
						isActive = pathname === "/dashboard"; // Only active if exactly on /dashboard
					} else {
						// For other routes like /dashboard/frameworks and /settings
						isActive = pathname.startsWith(link.href);
					}
					return (
						<div className="relative flex items-center" key={index}>
							{isActive && (
								<div className="absolute left-[-25] h-9 w-1 rounded-md bg-primary 2xl:w-1.5"></div>
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
										"dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
									link.variant === "lightBlue" && "text-black",
									"justify-start",
								)}
							>
								<link.icon
									className={`${
										isActive && "text-primary"
									} "mr-2 h-4 w-4" pr-2`}
								/>
								{link.title}
								{link.label && (
									<span
										className={cn(
											"ml-auto",
											link.variant === "default" &&
												"text-background dark:text-white",
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
