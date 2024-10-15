"use client";

import { Search01Icon } from "hugeicons-react";
import { useSession } from "next-auth/react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "~/app/_components/ui/avatar";
import { Input } from "~/app/_components/ui/input";

export default function Header() {
	const { data } = useSession();
	return (
		<header className="sticky inset-x-0 top-0 w-full border-b-2 border-b-[#E8E8EC] px-4 py-2">
			<nav className="flex items-center">
				<div className="w-64 px-3">
					<h2 className="text-2xl">CYBERMAP</h2>
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
