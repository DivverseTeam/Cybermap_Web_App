import * as z from "zod";
import { evidences } from "~/containers/evidence-library/db/schema";

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  name: z.string().optional(),
  status: z.string().optional(),
  linkedControls: z.array(z.string()).optional(),
  renewalDate: z.coerce.date().optional(), // coerces strings like '2023-12-01' to a Date object
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
});

export const getEvidencesSchema = searchParamsSchema;

export type GetEvidencesSchema = z.infer<typeof getEvidencesSchema>;

export const createEvidenceSchema = z.object({
  name: z.string(),
  description: z.string(),
  owner: z.string(),
  implementationGuide: z.string(),
  status: z.enum(evidences.status.enumValues).optional(),
  linkedControls: z.array(z.string()).optional(),
  renewalDate: z.coerce.date().optional(),
});

export type CreateEvidenceSchema = z.infer<typeof createEvidenceSchema>;

export const updateEvidenceSchema = z.object({
  name: z.string(),
  description: z.string(),
  owner: z.string(),
  implementationGuide: z.string(),
  status: z.enum(evidences.status.enumValues).optional(),
  linkedControls: z.array(z.string()).optional(),
  renewalDate: z.coerce.date().optional(),
});

export type UpdateEvidenceSchema = z.infer<typeof updateEvidenceSchema>;
