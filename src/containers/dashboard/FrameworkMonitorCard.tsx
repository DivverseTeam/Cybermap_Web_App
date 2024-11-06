import Image from "next/image";
import Link from "next/link";
import { Button } from "~/app/_components/ui/button";
import FrameworkComplianceProgress from "./FrameworkComplianceProgress";
import { frameworkIcons } from "./constants";

type FrameworkKey = keyof typeof frameworkIcons;

// type FrameworkIcon = (typeof frameworkIcons)[FrameworkKey];

export default function FrameworkMonitorCard({
	framework,
	progress,
	score,
	keyVal,
}: {
	framework: string;
	progress: string;
	score: string;
	keyVal: FrameworkKey;
}) {
	return (
		<div className="min-w-[217.6px] h-[228.35] border border-solid border-neutral-2 bg-white rounded-[8px] p-4 flex flex-col gap-2">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center gap-2">
					<div className="relative block h-5 w-5 rounded-[50%]">
						<Image
							src={frameworkIcons[keyVal]}
							alt="headerImage"
							fill={true}
							priority={true}
							style={{
								borderRadius: "50%",
								maxWidth: "100%",
								objectFit: "cover",
								objectPosition: "center",
							}}
						/>
					</div>
					<p className="text-base text-gray-12 font-semibold">{framework}</p>
				</div>
				<p className="text-xs text-gray-11 font-medium">{score}</p>
			</div>
			<div className="flex justify-center h-[128px] relative">
				<FrameworkComplianceProgress progress={progress} />
				<div className="flex flex-col items-center gap-[18px] absolute top-[4.5rem]">
					<div className="flex flex-col items-center gap-2 ">
						<p className="text-[25.84px] text-[#1E1B39] font-bold">
							{progress}%
						</p>
					</div>

					<Link href={`/frameworks/${framework}`}>
						<Button size="sm" variant="outline">
							View framework
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
