"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

const Policy = z.object({
	name: z.string(),
	frameworks: z.string().array(),
	lastApprovedOn: z.string().datetime().nullable(),
	lastDraft: z.string().datetime().nullable(),
	status: z.enum(["pending", "processing", "success", "failed"]),
});

type Policy = z.infer<typeof Policy>;

export const columns: ColumnDef<Policy>[] = [
	{
		accessorKey: "name",
		header: "Policy Name",
	},
	{
		accessorKey: "frameworks",
		header: "Frameworks",
	},
	{
		accessorKey: "lastApprovedOn",
		header: "Last approved on",
	},
	{
		accessorKey: "lastDraft",
		header: "Last draft",
	},
	{
		accessorKey: "status",
		header: "Status",
	},
];
