import React from "react";

export default function FrameComplianceList() {
	return (
		<div className="flex flex-col gap-[10px]">
			<div className="flex items-center justify-between">
				<p className="text-base text-[rgba(34, 34, 34, 1)] font-medium">
					SOC 2
				</p>
				<p className="text-xs leading-4 text-[rgba(34, 34, 34, 1)] font-medium">
					75%
				</p>
			</div>
			<div className="w-full bg-[#F1F5FA] h-2 rounded-md">
				<div className="w-[60%] bg-[#009E5C] h-2 rounded-md"></div>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-xs leading-[18px] text-gray-9 font-medium">
					120 controls completed
				</p>
				<p className="text-xs leading-4 text-gray-9 font-medium">167 total</p>
			</div>
		</div>
	);
}
