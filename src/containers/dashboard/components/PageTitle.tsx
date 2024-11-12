import React from "react";
import { cn } from "~/lib/utils";

type Props = {
	title: string;
	subtitle?: string;
	description: string;
	className?: string;
};

export default function PageTitle({
	title,
	subtitle,
	description,
	className,
}: Props) {
	return (
		<div className="flex flex-col gap-4 py-6">
			<div
				className={cn(
					"flex w-full items-baseline gap-2 bg-[#F9F9FB] font-semibold text-[16px] ",
					className,
				)}
			>
				<span
					className={`${
						subtitle ? "font-normal text-[#80838D] " : "text-black"
					}`}
				>
					{title}
				</span>
				{subtitle && <span className="mx-0">/</span>}
				<span className="text-black">{subtitle}</span>
			</div>
			<div className="flex flex-col gap-2 text-black">
				<span className="font-semibold text-xl">{subtitle}</span>
			</div>
		</div>
	);
}
