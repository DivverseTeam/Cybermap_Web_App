import type { Metadata } from "next/types";
import React from "react";
import LessonPage from "~/containers/compliance-guide/lesson";
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
