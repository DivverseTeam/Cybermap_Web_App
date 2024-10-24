import { sqliteTable } from "../db/utils";
import { sql } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";

import { generateId } from "~/lib/id";

export const evidences = sqliteTable("evidences", {
  id: text("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  // code: text("code", { length: 128 }).notNull().unique(),
  name: text("name", { length: 128 }),
  description: text("description", { length: 240 }),
  owner: text("owner", { length: 30 }),
  implementationGuide: text("implementation_guide", { length: 240 }),
  status: text("status", {
    length: 30,
    enum: ["Updated", "Needs artifact"],
  })
    .notNull()
    .default("Needs artifact"),
  linkedControls: text("linked_controls").notNull().default("[]"), // JSON-encoded array
  renewalDate: integer("renewal_date", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$default(() => sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});

export type Evidence = typeof evidences.$inferSelect;
export type NewEvidence = typeof evidences.$inferInsert;
