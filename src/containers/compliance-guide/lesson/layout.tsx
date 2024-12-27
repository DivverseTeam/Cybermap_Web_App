"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import type { FunctionComponent, ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "~/app/_components/ui/button";
import { api } from "~/trpc/react";

interface LessonLayoutProps {}

const LessonLayout: FunctionComponent<
  LessonLayoutProps & { children: ReactNode }
> = ({ children }) => {
  const params = useParams();
  const frameworkSlug = params["framework-slug"] as string;
  const lessonSlug = params["lesson-slug"] as string;
  const utils = api.useUtils();
  const router = useRouter();
  const _pathname = usePathname();

  const [course] = api.frameworks.compliance.getCourse.useSuspenseQuery({
    slug: frameworkSlug,
  });
  const { mutate: markCompletedMutation, isPending } =
    api.frameworks.compliance.markLessonCompleted.useMutation();

  const lessons = course.modules.flatMap((module) => module.lessons);
  const lessonIndex = lessons.findIndex((lesson) => lesson.slug === lessonSlug);
  const lesson = lessons[lessonIndex];
  const nextLesson = lessons[lessonIndex + 1];
  const previousLesson = lessons[lessonIndex - 1];
  // const module = course.modules[Math.floor(lesson!.id) - 1];

  const onMarkCompleted = () => {
    markCompletedMutation(
      {
        slug: frameworkSlug,
        lessonId: lesson!.id,
      },
      {
        onSuccess: () => {
          toast.success("Lesson marked as completed");
          utils.frameworks.compliance.getCourse.invalidate({
            slug: frameworkSlug,
          });
          utils.frameworks.getWithCompletion.invalidate();
          router.push(`./${nextLesson?.slug}`);
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-8 px-4 [@media(min-width:1400px)]:px-6">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Link href="./">
            <ChevronLeft />
          </Link>

          <h2 className="font-semibold text-2xl leading-[44px]">
            {lesson?.title}
          </h2>
        </div>

        <div className="flex items-center gap-8">
          <span>
            Module {lessonIndex + 1} of {lessons.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`./${previousLesson!.slug}`)}
              disabled={!previousLesson}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`./${nextLesson!.slug}`)}
              disabled={!nextLesson}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <div className="text-[#1C2024]">{children}</div>

      <div className="flex justify-end">
        <Button loading={isPending} onClick={onMarkCompleted} size="default">
          Mark as completed
        </Button>
      </div>
    </div>
  );
};

export default LessonLayout;
