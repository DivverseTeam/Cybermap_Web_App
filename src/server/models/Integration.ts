import mongoose from "mongoose";
import { z } from "zod";
import { BaseSchema } from "./base";

export const OrganisationIntegration = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  connectedAt: z.coerce.date().optional(),
  tenantId: z.string().optional(),
  workspaceId: z.string().optional(),
  subscriptionId: z.string().optional(),
  projectId: z.string().optional(),
  oauthProvider: z.string(),
  authData: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    expiry: z.coerce.date(),
  }),
  integrationId: z.string(),
  organisationId: z.string(),
});

export type OrganisationIntegration = z.infer<typeof OrganisationIntegration>;

type IntegrationWithDocument = OrganisationIntegration & mongoose.Document;

const IntegrationSchema = new BaseSchema<IntegrationWithDocument>({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  tenantId: { type: String, required: false },
  workspaceId: { type: String, required: false },
  subscriptionId: { type: String, required: false },
  projectId: { type: String, required: false },
  oauthProvider: { type: String, required: true },
  connectedAt: { type: Date, required: false },
  authData: {
    type: Object,
    required: false,
    default: {},
  },
  integrationId: { type: String, required: true },
  organisationId: { type: String, required: true },
});

export default (mongoose.models
  .Integration as mongoose.Model<IntegrationWithDocument>) ||
  mongoose.model("Integration", IntegrationSchema);
