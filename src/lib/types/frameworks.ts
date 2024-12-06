import z from "zod";
import { OrganisationControl } from "./controls";
import { FrameworkName } from "../types";

export const Framework = z.object({
  id: z.string(),
  name: FrameworkName,
  code: z.string(),
  logo: z.string().optional(),
  slug: z.string(),
});

export type Framework = z.infer<typeof Framework>;

export const OrganisationFramework = z.object({
  name: z.string(),
  logo: z.string().optional(),
  controls: OrganisationControl.array(),
  completionLevel: z.number(),
  complianceScore: z.object({
    passing: z.number(),
    failing: z.number(),
    risk: z.number(),
  }),
});

export type OrganisationFramework = z.infer<typeof OrganisationFramework>;
