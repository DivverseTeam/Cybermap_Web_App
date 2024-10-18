"use client";

import PageTitle from "~/components/PageTitle";
import FrameworkMonitorCard from "./FrameworkMonitorCard";
import { frameworklist } from "./constants";
import { Button } from "~/app/_components/ui/button";

export default function FrameworksPage() {
	return (
		<div className="flex flex-col gap-6">
			<PageTitle
				title="Frameworks"
				subtitle="Monitor and manage all your frameworks"
				action={
					<div className="flex items-center gap-2">
						<Button variant="outline">Customize widgets</Button>
						<Button>Create custom framework</Button>
					</div>
				}
			/>
			<div className="p-6 flex gap-6 flex-wrap">
				{frameworklist.map((item) => (
					<FrameworkMonitorCard {...item} />
				))}
			</div>
		</div>
	);
}
