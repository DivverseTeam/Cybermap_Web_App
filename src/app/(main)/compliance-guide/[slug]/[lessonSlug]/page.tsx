import React from "react";
import LessonPage from "~/containers/compliance-guide/LessonPage";
import { api } from "~/trpc/server";

type Props = {
  params: Promise<{ slug: string; lessonSlug: string }>;
};

export default async function Page(props: Props) {
  const params = await props.params;

  void api.frameworks.compliance.getCourse.prefetch({
    slug: params.slug,
  });

  return <LessonPage />;
}
