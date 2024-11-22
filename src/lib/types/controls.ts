import { z } from "zod";
import { CONTROL_STATUSES } from "../constants/controls";
import { FrameworkName } from "./frameworks";

export const ControlStatus = z.enum(CONTROL_STATUSES);
export type ControlStatus = z.infer<typeof ControlStatus>;

export const Control = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  mapped: FrameworkName.array(),
});

export type Control = z.infer<typeof Control>;

export const OrganisationControl = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  mapped: FrameworkName.array(),
  status: ControlStatus,
});

export type OrganisationControl = z.infer<typeof OrganisationControl>;
