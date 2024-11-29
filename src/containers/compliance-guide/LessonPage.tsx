"use client";

import { useParams } from "next/navigation";
import React, { type FunctionComponent } from "react";
import { api } from "~/trpc/react";
import Markdown from "markdown-to-jsx";
import { Button } from "~/app/_components/ui/button";
import { toast } from "sonner";

interface LessonPageProps {}

const LessonPage: FunctionComponent<LessonPageProps> = () => {
  const params = useParams();
  const slug = params.slug as string;
  const lessonSlug = params.lessonSlug as string;
  const utils = api.useUtils();

  const [course] = api.frameworks.compliance.getCourse.useSuspenseQuery({
    slug,
  });
  const { mutate: markCompletedMutation, isPending } =
    api.frameworks.compliance.markLessonCompleted.useMutation();

  const lessons = course.modules.flatMap((module) => module.lessons);
  const lesson = lessons.find((lesson) => lesson.slug === lessonSlug);
  // const module = course.modules[Math.floor(lesson!.id) - 1];

  const onMarkCompleted = () => {
    markCompletedMutation(
      {
        slug,
        lessonId: lesson!.id,
      },
      {
        onSuccess: () => {
          toast.success("Lesson marked as completed");
          utils.frameworks.compliance.getCourse.invalidate({ slug });
          // Push to the next lesson
        },
        onError: (error) => {
          console.log(error);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between">
        <h2 className="font-semibold text-2xl leading-[44px]">
          {lesson?.title}
        </h2>
        <Button loading={isPending} onClick={onMarkCompleted} size="default">
          Mark as completed
        </Button>
      </div>

      <div className="text-[#1C2024]">
        <Markdown
          options={{
            overrides: {
              h1: {
                component: "h1",
                props: {
                  className: "text-2xl font-semibold leading-[52px]",
                },
              },
              h2: {
                component: "h2",
                props: {
                  className: "text-xl font-semibold leading-[52px]",
                },
              },
              h3: {
                component: "h3",
                props: {
                  className: "text-lg font-semibold",
                },
              },
              h4: {
                component: "h4",
                props: {
                  className: "text-base font-semibold",
                },
              },
              h5: {
                component: "h5",
                props: {
                  className: "text-sm font-semibold",
                },
              },
              h6: {
                component: "h6",
                props: {
                  className: "text-xs font-semibold",
                },
              },
              p: {
                component: "p",
                props: {
                  className: "text-sm leading-7",
                },
              },
              a: {
                component: "a",
                props: {
                  className: "text-blue-500",
                },
              },
              ul: {
                component: "ul",
                props: {
                  className: "list-disc ml-6",
                },
              },
              ol: {
                component: "ol",
                props: {
                  className: "list-decimal ml-6 marker:text-sm",
                },
              },
              li: {
                component: "li",
                props: {},
              },
              blockquote: {
                component: "blockquote",
                props: {
                  className: "border-l-4 border-gray-300 pl-4 italic",
                },
              },
              code: {
                component: "code",
                props: {
                  className: "bg-gray-100 rounded-md px-1 py-0.5",
                },
              },
              pre: {
                component: "pre",
                props: {
                  className: "bg-gray-100 rounded-md p-4",
                },
              },
              img: {
                component: "img",
                props: {
                  className: "w-full",
                },
              },
            },
          }}
        >
          {lesson!.content}
        </Markdown>
      </div>
    </div>
  );
};

export default LessonPage;
