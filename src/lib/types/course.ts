import { z } from "zod";

export const CourseLesson = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  isCompleted: z.boolean().optional().default(false),
});

export type CourseLesson = z.infer<typeof CourseLesson>;

export const CourseSection = z.object({
  id: z.number(),
  title: z.string(),
  lessons: CourseLesson.array(),
});

export type CourseSection = z.infer<typeof CourseSection>;

export const Course = CourseSection.array();

export type Course = z.infer<typeof Course>;
