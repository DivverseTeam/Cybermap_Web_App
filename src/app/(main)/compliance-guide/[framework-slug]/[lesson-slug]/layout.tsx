import LessonLayout from "~/containers/compliance-guide/lesson/layout";

export default function LessonLayoutPage({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <LessonLayout>{children}</LessonLayout>;
}
