import { z } from "zod";

export const INTEGRATION_CATEGORIES = ["CLOUD", "IDENTITY"] as const;
export const IntegrationCategory = z.enum(INTEGRATION_CATEGORIES);
export type IntegrationCategory = z.infer<typeof IntegrationCategory>;

export const INTEGRATION_PLATFORMS = [
  "GCP",
  "AWS",
  "AZURE",
  "AZURE_AD",
] as const;
export const IntegrationPlatform = z.enum(INTEGRATION_PLATFORMS);
export type IntegrationPlatform = z.infer<typeof IntegrationPlatform>;

export const Integration = z.object({
  id: z.string(),
  image: z.string().url(),
  name: z.string(),
  category: IntegrationCategory,
  description: z.string(),
});

export type Integration = z.infer<typeof Integration>;

export const OAUTH2_PROVIDERS = ["GOOGLE", "MICROSOFT"] as const;
export const Oauth2Provider = z.enum(OAUTH2_PROVIDERS);
export type Oauth2Provider = z.infer<typeof Oauth2Provider>;
