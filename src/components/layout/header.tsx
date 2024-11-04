"use client";

import { HelpSquareIcon, Search01Icon } from "hugeicons-react";
import { useSession } from "next-auth/react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "~/app/_components/ui/avatar";
import { Input } from "~/app/_components/ui/input";
import { CyberMapBrand } from "../svgs/CyberMapBrand";

export default function Header() {
	const { data } = useSession();
	return (
		<header className="sticky inset-x-0 top-0 z-10 w-full border-b-2 border-b-[#E8E8EC] bg-white px-4 py-2">
			<nav className="flex items-center">
				<div className="w-64 px-3">
					<CyberMapBrand />
				</div>

				<div className="flex-grow">
					<div className="flex justify-between">
						<Input
							placeholder="Search for anything..."
							className="bg-[#F9F9FB] w-72"
							suffix={
								<span className="cursor-pointer">
									<Search01Icon size="12" />
								</span>
							}
						/>

						<span className="flex items-center gap-2">
							{" "}
							<span className="mr-4 text-gray-500">
								<HelpSquareIcon />
							</span>
							<Avatar className="h-6 w-6 rounded-xs">
								<AvatarImage src="" />
								<AvatarFallback>TU</AvatarFallback>
							</Avatar>
							<span className="flex flex-col">
								<span className="text-[#80828D] text-sm">
									{data?.user.name}
								</span>
								<span className="text-[#B9BBC6] text-xs">
									{data?.user?.email}
								</span>
							</span>
						</span>
					</div>
				</div>
			</nav>
		</header>
	);
}
