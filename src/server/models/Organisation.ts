import mongoose from "mongoose";
import { z } from "zod";
import {
  ORGANISATION_INDUSTRIES,
  ORGANISATION_KINDS,
  ORGANISATION_SIZES,
  OrganisationIndustry,
  OrganisationKind,
  OrganisationSize,
} from "~/lib/types";
import { BaseSchema } from "./base";
import { FrameworkName } from "~/lib/types";

export const OrganisationIntegration = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  connectedAt: z.coerce.date(),
  authData: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    expiry: z.coerce.date(),
  }),
});

export type OrganisationIntegration = z.infer<typeof OrganisationIntegration>;

export const Organisation = z.object({
  id: z.string(),
  logoUrl: z.string().optional(),
  name: z.string(),
  size: OrganisationSize,
  kind: OrganisationKind,
  industry: OrganisationIndustry,
  frameworks: z.array(FrameworkName).optional().default([]),
  integrations: z.array(OrganisationIntegration).default([]),
});

export type Organisation = z.infer<typeof Organisation>;

type OrganisationWithDocument = Organisation & mongoose.Document;

const OrganisationSchema = new BaseSchema<OrganisationWithDocument>({
  logoUrl: { type: String, required: false },
  name: { type: String, required: true },
  size: { type: String, enum: ORGANISATION_SIZES, required: true },
  kind: {
    type: String,
    enum: ORGANISATION_KINDS,
    required: true,
  },
  industry: {
    type: String,
    enum: ORGANISATION_INDUSTRIES,
    required: true,
  },
  frameworks: {
    type: [{ type: String }],
    required: false,
    default: [],
  },
  integrations: {
    type: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        connectedAt: { type: Date, required: true },
        authData: {
          type: Object,
          required: false,
          default: {},
        },
      },
    ],
    required: false,
    default: [],
  },
});

export default (mongoose.models
  .Organisation as mongoose.Model<OrganisationWithDocument>) ||
  mongoose.model("Organisation", OrganisationSchema);
