import { z } from "zod";

export const USER_ROLES = ["ADMIN", "COMPLIANCE_OFFICER", "AUDITOR"] as const;

export const UserRole = z.enum([...USER_ROLES]);
export type UserRole = z.infer<typeof UserRole>;
