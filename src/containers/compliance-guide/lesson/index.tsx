"use client";

import { useParams } from "next/navigation";
import React, { type FunctionComponent } from "react";
import { api } from "~/trpc/react";
import Markdown, { RuleType } from "markdown-to-jsx";
import PolicyTemplate from "./policy-template";
import Link from "next/link";

interface LessonPageProps {}

const LessonPage: FunctionComponent<LessonPageProps> = () => {
  const params = useParams();
  const frameworkSlug = params["framework-slug"] as string;
  const lessonSlug = params["lesson-slug"] as string;

  const [course] = api.frameworks.compliance.getCourse.useSuspenseQuery({
    slug: frameworkSlug,
  });

  const lessons = course.modules.flatMap((module) => module.lessons);
  const lessonIndex = lessons.findIndex((lesson) => lesson.slug === lessonSlug);
  const lesson = lessons[lessonIndex];

  return (
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
          renderRule(next, node, _renderChildren, _state) {
            if (node.type === RuleType.link) {
              if (
                node.target.startsWith(
                  "https://cybermap.circle.so/c/all-documents/",
                ) &&
                //@ts-ignore
                "text" in node.children[0]
              ) {
                const documentSlug = node.target.split("/").pop();
                return (
                  <Link
                    href={{
                      query: {
                        title: node.children[0].text,
                        slug: documentSlug,
                      },
                    }}
                    scroll={false}
                    className="font-semibold text-blue-500 text-lg leading-10"
                  >
                    {node.children[0].text || ""}
                  </Link>
                );
              }
            }
            return next();
          },
        }}
      >
        {lesson!.content}
      </Markdown>
      <PolicyTemplate />
    </div>
  );
};

export default LessonPage;
