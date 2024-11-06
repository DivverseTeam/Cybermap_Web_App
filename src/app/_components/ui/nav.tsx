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
			className="group flex flex-col gap-2 py-2 data-[collapsed=true]:py-2 text-sm text-[#80828D] "
		>
			{!["home", "actions"].includes(groupName.toLocaleLowerCase()) && (
				<span className="uppercase font-[500] text-[#B9BBC6] text-sm mt-[-10px]">
					{groupName}
				</span>
			)}
			<nav className=" grid gap-1 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
				{links.map((link: any, index) => (
					<div className="flex items-center relative" key={index}>
						{pathname.startsWith(`${link.href}`) &&
							pathname.includes(
								`${link.href}`.split("/").slice(2).join("/"),
							) && (
								<div className="h-9 w-1 absolute left-[-25] bg-primary"></div>
							)}
						<Link
							key={index}
							href={`${link.href}`}
							className={cn(
								buttonVariants({
									variant:
										pathname.startsWith(`${link.href}`) &&
										pathname.includes(
											`${link.href}`.split("/").slice(2).join("/"),
										)
											? "lightBlue"
											: "ghost",
									size: "xs",
								}),
								link.variant === "default" &&
									"dark:bg-muted dark:text-white dark:hover:bg-muted  dark:hover:text-white",
								link.variant === "lightBlue" && "text-black",
								"justify-start",
							)}
						>
							<link.icon
								className={`${
									pathname.startsWith(`${link.href}`) && "text-primary"
								} "mr-2 h-4 w-4"`}
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
				))}
			</nav>
		</div>
	);
}
