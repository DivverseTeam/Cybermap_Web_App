"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { VariantProps } from "class-variance-authority";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { z } from "zod";
import { Badge, type badgeVariants } from "~/app/_components/ui/badge";
import { Button } from "~/app/_components/ui/button";
import TagsContainer from "~/components/TagContainer";
import { slugify } from "~/lib/utils";

const PolicyStatus = z.enum(["PENDING", "APPROVED", "DRAFT"]);
type PolicyStatus = z.infer<typeof PolicyStatus>;

const Policy = z.object({
  id: z.string(),
  name: z.string(),
  frameworks: z.string().array(),
  lastApprovedOn: z.string().datetime().nullable(),
  lastDraft: z.string().datetime().nullable(),
  status: z.enum(["PENDING", "APPROVED", "DRAFT"]),
});

export type Policy = z.infer<typeof Policy>;

export const columns: ColumnDef<Policy>[] = [
  {
    accessorKey: "name",
    header: "Policy Name",
  },
  {
    accessorKey: "frameworks",
    header: "Frameworks",
    cell: ({ getValue }) => {
      const frameworks = getValue<string[]>();
      return <TagsContainer tags={frameworks} />;
    },
  },
  {
    accessorKey: "lastApprovedOn",
    header: "Last approved on",
    cell: ({ getValue }) => {
      const lastApprovedOn = getValue<string | null>();
      return lastApprovedOn ? format(lastApprovedOn, "dd MMMM yyyy") : "-";
    },
  },
  {
    accessorKey: "lastDraft",
    header: "Last draft",
    cell: ({ getValue }) => {
      const lastDraft = getValue<string>();
      return formatDistanceToNow(lastDraft);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue<PolicyStatus>();

      let displayText = status[0] + status.slice(1).toLowerCase();
      let badgeVariant: VariantProps<typeof badgeVariants>["variant"];

      if (status === "PENDING") {
        badgeVariant = "warning";
        displayText = "Pending approval";
      }

      if (status === "APPROVED") {
        badgeVariant = "success";
      }

      if (status === "DRAFT") {
        badgeVariant = "default";
      }

      return (
        <Badge className="w-max font-semibold" variant={badgeVariant}>
          {displayText}
        </Badge>
      );
    },
  },
  {
    accessorKey: "id",
    header: "",
    cell: ({ getValue: _, row }) => {
      const slug = slugify(row.original.name);

      return (
        <Link href={`/policies/${slug}`}>
          <Button variant="outline" size="sm">
            Edit Policy
          </Button>
        </Link>
      );
    },
  },
];
