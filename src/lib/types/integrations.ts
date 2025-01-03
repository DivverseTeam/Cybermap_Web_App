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

export const OAUTH2_PROVIDERS = ["GOOGLE", "MICROSOFT"] as const;
export const Oauth2Provider = z.enum(OAUTH2_PROVIDERS);
export type Oauth2Provider = z.infer<typeof Oauth2Provider>;

export const AZURE_CLOUD_SLUG = ["azure-ad", "azure-cloud"] as const;
export const azureCloudSlug = z.enum(AZURE_CLOUD_SLUG);
export type azureCloudSlug = z.infer<typeof azureCloudSlug>;

export const Integration = z.object({
  id: z.string(),
  image: z.string(),
  name: z.string(),
  slug: z.string(),
  category: IntegrationCategory,
  oauthProvider: Oauth2Provider.optional(),
  description: z.string(),
});

export type Integration = z.infer<typeof Integration>;
