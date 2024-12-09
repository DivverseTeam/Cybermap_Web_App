import type { Metadata } from "next";
import React from "react";
import ViewFrameworkCompliance from "~/containers/compliance-guide/view-framework-compliance/ViewFrameworkCompliance";
import { api } from "~/trpc/server";

type Props = {
  params: Promise<{ "framework-slug": string }>;
};

export default async function Page(props: Props) {
  const params = await props.params;

  void api.frameworks.compliance.getCourse.prefetch({
    slug: params["framework-slug"],
  });

  return <ViewFrameworkCompliance />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const awaitedParams = await params;

  const course = await api.frameworks.getWithSlug({
    slug: awaitedParams["framework-slug"],
  });

  const title = `Compliance Guide For ${course?.name || ""}`;

  return {
    title,
  };
}
