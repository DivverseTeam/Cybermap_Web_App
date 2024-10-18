"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Use useParams from next/navigation
import Link from "next/link";

import { Button } from "~/app/_components/ui/button";
import ViewFrameworks from "~/containers/dashboard/frameworks/view-framework/ViewFrameworks";
import PageTitle from "~/components/PageTitle";
// import ViewFramework from "~/containers/dashboard/frameworks/view-frameworks/ViewFramework";

const frameworkData: any = {
	1: {
		name: "React",
		description: "A JavaScript library for building user interfaces.",
	},
	2: {
		name: "Vue",
		description: "A progressive framework for building user interfaces.",
	},
	3: {
		name: "Angular",
		description: "A platform for building mobile and desktop web applications.",
	},
};

export default function ViewFramework() {
	const { id } = useParams(); // Get the dynamic route parameter
	const [framework, setFramework] = useState(null);

	// useEffect(() => {
	// 	// Simulate fetching data from an API or database
	// 	if (id) {
	// 		const frameworkDetails = frameworkData[id];
	// 		setFramework(frameworkDetails);
	// 	}
	// }, [id]);

	// if (!framework) return <div>Loading...</div>;

	return (
		<div>
			<PageTitle
				title="Frameworks"
				action={<Button variant="outline">Add new category</Button>}
			/>

			{/* Content */}
			<ViewFrameworks />

			{/* <Link href="/dashboard/frameworks">
				<p className="text-blue-600 hover:underline">Back to Frameworks</p>
			</Link> */}
		</div>
	);
}
