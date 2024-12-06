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
