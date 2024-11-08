import React from "react";

export default function FrameComplianceList() {
	return (
		<div className="flex flex-col gap-[10px]">
			<div className="flex items-center justify-between">
				<p className="34, 34, 1)] font-medium text-[rgba(34, text-base">
					SOC 2
				</p>
				<p className="34, 34, 1)] font-medium text-[rgba(34, text-xs leading-4">
					75%
				</p>
			</div>
			<div className="h-2 w-full rounded-md bg-[#F1F5FA]">
				<div className="h-2 w-[60%] rounded-md bg-[#009E5C]"></div>
			</div>
			<div className="flex items-center justify-between">
				<p className="font-medium text-gray-9 text-xs leading-[18px]">
					120 controls completed
				</p>
				<p className="font-medium text-gray-9 text-xs leading-4">167 total</p>
			</div>
		</div>
	);
}
