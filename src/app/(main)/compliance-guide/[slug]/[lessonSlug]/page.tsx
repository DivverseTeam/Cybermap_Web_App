import type { Metadata } from "next/types";
import React from "react";
import LessonPage from "~/containers/compliance-guide/lesson";
import { api } from "~/trpc/server";
// TODO: Update to use the "use cache" directive
import { unstable_cache } from "next/cache";

type Props = {
  params: Promise<{ slug: string; lessonSlug: string }>;
};

export default function Page(_props: Props) {
  return <LessonPage />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = "", lessonSlug = "" } = await params;

  const course = await api.frameworks.compliance.getCourse({ slug });
  const lessons = course.modules.flatMap((module) => module.lessons);
  const lessonIndex = lessons.findIndex((lesson) => lesson.slug === lessonSlug);
  const lesson = lessons[lessonIndex];

  const title = `${lesson?.title || ""}`;

  return {
    title,
  };
}
