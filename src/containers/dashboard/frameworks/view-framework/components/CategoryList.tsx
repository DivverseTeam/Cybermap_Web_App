import React from "react";

export default function CategoryList() {
	return (
		<div className="text-sm flex flex-col gap-4">
			<h3 className="uppercase text-secondary font-semibold">
				REQUIREMENT CATEGORIES
			</h3>
			<ul className="list-none text-secondary flex flex-col gap-4">
				<li>CC1.0 Control Environment</li>
				<li>CC2.0 Communication and information</li>
				<li>CC3.0 Risk Assessment</li>
				<li>CC4.0 Monitoring Activities</li>
				<li>CC5.0 Control Activities</li>
				<li>CC6.0 Logical and Physical Access Controls</li>
				<li>CC7.0 System Operations</li>
			</ul>
		</div>
	);
}
