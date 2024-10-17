import React from "react";
import PageTitle from "~/containers/dashboard/components/PageTitle";

import Link from "next/link";

const frameworks = [
  {
    id: 1,
    name: "React",
    description: "Monitor and manage all your frameworks",
  },
  { id: 2, name: "Vue", description: "Monitor and manage all your frameworks" },
  {
    id: 3,
    name: "Angular",
    description: "Monitor and manage all your frameworks",
  },
  // Add more frameworks as needed
];

export default function FrameworksPage() {
  return (
    <div className="flex flex-col h-full">
      <PageTitle
        title="Frameworks"
        description="Monitor and manage all your frameworks"
      />

      <div className="">
        <ul className="">
          {frameworks.map((framework) => (
            <li key={framework.id} className="mb-2">
              <Link href={`/dashboard/frameworks/${framework.id}`}>
                <p className="text-blue-600 hover:underline">
                  {framework.name}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
