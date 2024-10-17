"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Use useParams from next/navigation
import Link from "next/link";
import PageTitle from "~/containers/dashboard/components/PageTitle";
import { Button } from "~/app/_components/ui/button";

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
  const { id }: any = useParams(); // Get the dynamic route parameter
  const [framework, setFramework] = useState<any>(null);

  useEffect(() => {
    // Simulate fetching data from an API or database
    if (id) {
      const frameworkDetails = frameworkData[id];
      setFramework(frameworkDetails);
    }
  }, [id]);

  if (!framework) return <div>Loading...</div>;

  return (
    <div>
      <PageTitle
        title="Frameworks"
        subtitle={framework.name}
        description={framework.description}
      />
      <div className="flex justify-between items-center mt-[-28px] text-secondary">
        <span className="text-sm">{framework.description}</span>
        <Button variant="outline">Add new category</Button>
      </div>
      {/* Content */}

      <Link href="/dashboard/frameworks">
        <p className="text-blue-600 hover:underline">Back to Frameworks</p>
      </Link>
    </div>
  );
}
