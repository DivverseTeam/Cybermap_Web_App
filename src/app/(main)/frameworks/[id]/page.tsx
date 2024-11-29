"use client";

import Link from "next/link";
import { useParams } from "next/navigation"; // Use useParams from next/navigation
import { useEffect, useState } from "react";

import { Button } from "~/app/_components/ui/button";
import PageTitle from "~/components/PageTitle";
import ViewFrameworks from "~/containers/frameworks/view-framework/ViewFrameworks";
// import ViewFramework from "~/containers/dashboard/frameworks/view-frameworks/ViewFramework";

export default function page() {
  // const { id } = useParams(); // Get the dynamic route parameter

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
