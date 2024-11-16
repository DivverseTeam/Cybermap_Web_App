import mongoose from "mongoose";
import { z } from "zod";

import { BaseSchema } from "./base";

export const INTEGRATION_PLATFORMS = [
  "GCP",
  "AWS",
  "AZURE",
  "AZURE_AD",
] as const;
export const IntegrationPlatform = z.enum(INTEGRATION_PLATFORMS);
export type IntegrationPlatform = z.infer<typeof IntegrationPlatform>;

// Define base fields for Integration
const baseIntegrationFields = {
  id: z.string(),
  organisationId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
};

// Define platform-specific schemas using discriminated union
export const Integration = z.discriminatedUnion("platform", [
  z.object({
    ...baseIntegrationFields,
    platform: z.literal("AWS"),
    secretKey: z.string(),
    accessKey: z.string(),
  }),
  z.object({
    ...baseIntegrationFields,
    platform: z.literal("GCP"),
    serviceAccountKey: z.string(),
  }),
  z.object({
    ...baseIntegrationFields,
    platform: z.literal("AZURE"),
    tenantId: z.string(),
    clientId: z.string(),
    clientSecret: z.string(),
  }),
  z.object({
    ...baseIntegrationFields,
    platform: z.literal("AZURE_AD"),
    clientId: z.string(),
    clientSecret: z.string(),
    directoryId: z.string(),
  }),
]);

export type Integration = z.infer<typeof Integration>;

type IntegrationWithDocument = Integration & mongoose.Document;

const IntegrationSchema = new BaseSchema<IntegrationWithDocument>({
  platform: {
    type: String,
    required: true,
    enum: INTEGRATION_PLATFORMS,
  },
  organisationId: {
    type: String,
    required: true,
  },
  secretKey: String,
  accessKey: String,
  serviceAccountKey: String,
  tenantId: String,
  clientId: String,
  clientSecret: String,
  directoryId: String,
});

export default (mongoose.models
  .Integration as mongoose.Model<IntegrationWithDocument>) ||
  mongoose.model("Integration", IntegrationSchema);
