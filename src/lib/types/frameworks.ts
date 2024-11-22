import z from "zod";
import { FRAMEWORK_NAMES } from "../constants/frameworks";

export const FrameworkName = z.enum(FRAMEWORK_NAMES);
export type FrameworkName = z.infer<typeof FrameworkName>;

export const Framework = z.object({
  id: z.string(),
  name: FrameworkName,
  code: z.string(),
});

export type Framework = z.infer<typeof Framework>;
