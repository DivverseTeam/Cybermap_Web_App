import * as z from "zod";

export const EVIDENCE_STATUSES = [
	"NEEDS_ARTIFACT",
	"COMPLETED",
	"IN_PROGRESS",
] as const;
export const EvidenceStatus = z.enum(EVIDENCE_STATUSES);
export type EvidenceStatus = z.infer<typeof EvidenceStatus>;

export const searchParamsSchema = z
	.object({
		page: z.coerce.number().default(1),
		per_page: z.coerce.number().default(10),
		sort: z.coerce.string().optional(),
		name: z.string().optional(),
		status: z.string().optional(),
		linkedControls: z.array(z.string()).optional(),
		renewalDate: z.coerce.date().optional(), // coerces strings like '2023-12-01' to a Date object
		from: z.string().optional(),
		to: z.string().optional(),
		operator: z.enum(["and", "or"]).optional(),
	})
	.optional();

export const getEvidencesSchema = searchParamsSchema;

export type GetEvidencesSchema = z.infer<typeof getEvidencesSchema>;

export const createEvidenceSchema = z.object({
	name: z.string(),
	description: z.string(),
	owner: z.string(),
	implementationGuide: z.string(),
	status: EvidenceStatus.optional(),
	linkedControls: z.array(z.string()).optional(),
	renewalDate: z.coerce.date().optional(),
});

export type CreateEvidenceSchema = z.infer<typeof createEvidenceSchema>;

export const updateEvidenceSchema = z.object({
	name: z.string(),
	description: z.string(),
	owner: z.string(),
	implementationGuide: z.string(),
	status: EvidenceStatus.optional(),
	linkedControls: z.array(z.string()).optional(),
	renewalDate: z.coerce.date().optional(),
});

export type UpdateEvidenceSchema = z.infer<typeof updateEvidenceSchema>;
