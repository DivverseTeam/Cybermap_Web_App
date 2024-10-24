import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { db } from "~/containers/evidence-library/db";
import {
  evidences,
  type Evidence,
} from "~/containers/evidence-library/db/schema";
import { type DrizzleWhere } from "~/types";
import { and, asc, count, desc, gte, lte, or, type SQL } from "drizzle-orm";

import { filterColumn } from "~/lib/filter-column";

import { type GetEvidencesSchema } from "./validations";

interface EvidenceResponse {
  data: Evidence[];
  totalRows: number;
  pageCount: number;
}

interface EvidenceCount {
  status?: string;
  // priority?: string;
  count: number;
}

export async function getEvidences(
  input: GetEvidencesSchema
): Promise<EvidenceResponse> {
  noStore();
  const {
    page,
    per_page,
    sort,
    name,
    status,
    linkedControls,
    renewalDate,
    operator,
    from,
    to,
  } = input;

  try {
    // Calculate offset for pagination
    const offset = (page - 1) * per_page;
    // Split the sort string to determine column and order (e.g., "title.desc" => ["title", "desc"])
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Evidence | undefined, "asc" | "desc" | undefined];

    // Convert date strings to Date objects for date filtering
    const fromDay = from ? new Date(from) : undefined;
    const toDay = to ? new Date(to) : undefined;

    const expressions: (SQL<unknown> | undefined)[] = [
      // Apply title filter if provided
      name
        ? filterColumn({
            column: evidences.name,
            value: name,
          })
        : undefined,
      // Apply status filter if provided
      !!status
        ? filterColumn({
            column: evidences.status,
            value: status,
            isSelectable: true,
          })
        : undefined,
      // Apply date range filter if both dates are provided
      fromDay && toDay
        ? and(
            gte(evidences.createdAt, fromDay),
            lte(evidences.createdAt, toDay)
          )
        : undefined,
    ];

    // Combine filters using "and" or "or" based on the operator
    const where: DrizzleWhere<Evidence> =
      !operator || operator === "and"
        ? and(...expressions)
        : or(...expressions);

    // Execute queries within a transaction for consistency
    const { data, totalRows } = await db.transaction(async (tx: any) => {
      const data = await tx
        .select()
        .from(evidences)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in evidences
            ? order === "asc"
              ? asc(evidences[column])
              : desc(evidences[column])
            : desc(evidences.id)
        );

      const totalRows = await tx
        .select({ count: count() })
        .from(evidences)
        .where(where)
        .execute()
        .then((res: any) => res[0]?.count ?? 0);

      return {
        data,
        totalRows,
      };
    });

    // Calculate the total number of pages
    const pageCount = Math.ceil(totalRows / per_page);
    return { data, totalRows, pageCount };
  } catch (err) {
    // Log error for debugging
    console.error(err);
    return { data: [], totalRows: 0, pageCount: 0 };
  }
}

export async function getEvidenceCountByStatus(): Promise<EvidenceCount[]> {
  noStore();
  try {
    return await db
      .select({
        status: evidences.status,
        count: count(),
      })
      .from(evidences)
      .groupBy(evidences.status)
      .execute();
  } catch (err) {
    return [];
  }
}

// export async function getTaskCountByPriority(): Promise<TaskCount[]> {
//   noStore();
//   try {
//     return await db
//       .select({
//         priority: evidences.priority,
//         count: count(),
//       })
//       .from(evidences)
//       .groupBy(evidences.priority)
//       .execute();
//   } catch (err) {
//     return [];
//   }
// }
