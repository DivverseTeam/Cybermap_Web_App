"use client";

import CategoryCard from "./components/CategoryCard";
import CategoryList from "./components/CategoryList";
import ControlCompletionCard from "./components/ControlCompletionCard";

const frameworkCategories = [
	{
		name: "CC1.0 Control Environment",
		controlGroup: [
			{
				name: "CC1.1",
				controls: [
					{
						name: "Risk management program established",
						description:
							"The employee performs background checks on new employees",
						evidencesCollected: 3,
						evidencesExpected: 4,
						assignedTo: "John Doe",
					},
					{
						name: "Employee background checks performed",
						description:
							"The employee performs background checks on new employees",
						evidencesCollected: 2,
						evidencesExpected: 5,
						assignedTo: "John Doe",
					},
					{
						name: "Office equipments checked ",
						description:
							"The employee performs background checks on new employees",
						evidencesCollected: 7,
						evidencesExpected: 8,
						assignedTo: "John Doe",
					},
				],
			},
		],
	},
	{
		name: "CC2.0 Communication and information",
		controlGroup: [
			{
				name: "CC1.1",
				controls: [
					{
						name: "Risk management program established",
						description:
							"The employee performs background checks on new employees",
						evidencesCollected: 3,
						evidencesExpected: 4,
						assignedTo: "John Doe",
					},
					{
						name: "Employee background checks performed",
						description:
							"The employee performs background checks on new employees",
						evidencesCollected: 2,
						evidencesExpected: 5,
						assignedTo: "John Doe",
					},
					{
						name: "Office equipments checked ",
						description:
							"The employee performs background checks on new employees",
						evidencesCollected: 7,
						evidencesExpected: 8,
						assignedTo: "John Doe",
					},
				],
			},
		],
	},
	{
		name: "CC3.0 Risk Assessment",
		controlGroup: [
			{
				name: "CC1.1",
				controls: [
					{
						name: "Risk management program established",
						description:
							"The employee performs background checks on new employees",
						evidencesCollected: 3,
						evidencesExpected: 4,
						assignedTo: "John Doe",
					},
					{
						name: "Employee background checks performed",
						description:
							"The employee performs background checks on new employees",
						evidencesCollected: 2,
						evidencesExpected: 5,
						assignedTo: "John Doe",
					},
					{
						name: "Office equipments checked ",
						description:
							"The employee performs background checks on new employees",
						evidencesCollected: 7,
						evidencesExpected: 8,
						assignedTo: "John Doe",
					},
				],
			},
		],
	},
	{
		name: "CC4.0 Monitoring Activities",
		controlGroup: [
			{
				name: "CC1.1",
				controls: [
					{
						name: "Risk management program established",
						description:
							"The employee performs background checks on new employees",
						evidencesCollected: 3,
						evidencesExpected: 4,
						assignedTo: "John Doe",
					},
					{
						name: "Employee background checks performed",
						description:
							"The employee performs background checks on new employees",
						evidencesCollected: 2,
						evidencesExpected: 5,
						assignedTo: "John Doe",
					},
					{
						name: "Office equipments checked ",
						description:
							"The employee performs background checks on new employees",
						evidencesCollected: 7,
						evidencesExpected: 8,
						assignedTo: "John Doe",
					},
				],
			},
		],
	},
	{
		name: "CC5.0 Control Activities",
		controlGroup: [
			{
				name: "CC1.1",
				controls: [
					{
						name: "Risk management program established",
						description:
							"The employee performs background checks on new employees",
						evidencesCollected: 3,
						evidencesExpected: 4,
						assignedTo: "John Doe",
					},
					{
						name: "Employee background checks performed",
						description:
							"The employee performs background checks on new employees",
						evidencesCollected: 2,
						evidencesExpected: 5,
						assignedTo: "John Doe",
					},
					{
						name: "Office equipments checked ",
						description:
							"The employee performs background checks on new employees",
						evidencesCollected: 7,
						evidencesExpected: 8,
						assignedTo: "John Doe",
					},
				],
			},
		],
	},
	{
		name: "CC6.0 Logical and Physical Access Controls",
		controlGroup: [
			{
				name: "CC1.1",
				controls: [
					{
						name: "Risk management program established",
						description:
							"The employee performs background checks on new employees",
						evidencesCollected: 3,
						evidencesExpected: 4,
						assignedTo: "John Doe",
					},
					{
						name: "Employee background checks performed",
						description:
							"The employee performs background checks on new employees",
						evidencesCollected: 2,
						evidencesExpected: 5,
						assignedTo: "John Doe",
					},
					{
						name: "Office equipments checked ",
						description:
							"The employee performs background checks on new employees",
						evidencesCollected: 7,
						evidencesExpected: 8,
						assignedTo: "John Doe",
					},
				],
			},
		],
	},
	{
		name: "CC7.0 System Operations",
		controlGroup: [
			{
				name: "CC1.1",
				controls: [
					{
						name: "Risk management program established",
						description:
							"The employee performs background checks on new employees",
						evidencesCollected: 3,
						evidencesExpected: 4,
						assignedTo: "John Doe",
					},
					{
						name: "Employee background checks performed",
						description:
							"The employee performs background checks on new employees",
						evidencesCollected: 2,
						evidencesExpected: 5,
						assignedTo: "John Doe",
					},
					{
						name: "Office equipments checked ",
						description:
							"The employee performs background checks on new employees",
						evidencesCollected: 7,
						evidencesExpected: 8,
						assignedTo: "John Doe",
					},
				],
			},
		],
	},
];

export default function ViewFrameworks() {
	return (
		<div className="mx-auto flex justify-between gap-5 py-3">
			{/* framework info */}
			<div className="flex w-[261px] min-w-[28%] flex-col gap-8">
				{/* progress */}
				<ControlCompletionCard />

				{/* categories list */}
				<CategoryList />
			</div>

			{/* framework categories details  */}
			<div className="flex w-[736px] min-w-[69%] flex-col">
				{frameworkCategories.map((category: any, _key: any) => (
					<CategoryCard frameworkCategory={category} key={category.name} />
				))}
			</div>
		</div>
	);
}
