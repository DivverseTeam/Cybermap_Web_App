import React from "react";
import SemicircleProgress from "./SemicircleProgress";

type Props = {};

export default function ControlCompletionCard({}: Props) {
	return (
		<div className="rounded-sm flex flex-col items-center bg-white p-4 gap-0 h-[170px] 2xl:h-[25vh] justify-center">
			<SemicircleProgress percentage={72} />
			<span className="mt-[-30px] text-xs font-semibold text-secondary">
				120/180 Controls completed
			</span>
		</div>
	);
}
