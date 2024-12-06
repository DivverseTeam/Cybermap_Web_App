import { z } from "zod";
import { PRESIGNED_URL_TYPES } from "~/lib/types";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import mongoose from "mongoose";
import { AuthorizationCode } from "simple-oauth2";
import { Resource } from "sst";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { integrations } from "~/lib/constants/integrations";
import {
  MICROSOFT_OAUTH_ARM_SCOPE,
  MICROSOFT_OAUTH_SCOPE,
  getOauth2Config,
} from "~/server/constants/integrations";
import Integration from "~/server/models/Integration";

export const IntegrationOauth2Props = z.union([
  z.object({
    provider: z.literal("MICROSOFT"),
    tenantId: z.string().uuid(),
    subscriptionId: z.string().uuid(),
    workspaceId: z.string().optional(),
    slug: z.string().optional(),
  }),
  z.object({
    provider: z.literal("GOOGLE"),
    projectId: z.string(),
    slug: z.string().optional(),
  }),
]);

export type IntegrationOauth2Props = z.infer<typeof IntegrationOauth2Props>;

export const generalRouter = createTRPCRouter({
  getS3PresignedUrl: protectedProcedure
    .input(
      z.object({
        type: z.enum([...PRESIGNED_URL_TYPES]),
        fileType: z.string(),
        id: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { type, fileType } = input;

      const id = input?.id || new mongoose.Types.ObjectId().toString();

      const client = new S3Client({});

      let key: string = id;

      if (type === "ORGANISATION_LOGO") {
        key = `media/organisation_logos/${id}`;
      }

      const command = new PutObjectCommand({
        Bucket: Resource.images.name,
        Key: key,
        ...(fileType && {
          Metadata: {
            "content-type": fileType,
          },
        }),
      });

      const url = await getSignedUrl(client, command, { expiresIn: 60 * 60 });

      return {
        url,
        id,
      };
    }),

  oauth2: createTRPCRouter({
    authorization: protectedProcedure
      .input(IntegrationOauth2Props)
      .mutation(async ({ input, ctx }) => {
        const { provider, slug, ...restInput } = input;
        const {
          session: {
            user: { organisationId },
          },
        } = ctx;

        if (!organisationId) {
          throw new Error("No organisation found");
        }

        const integration = integrations.find(
          (integration) => integration?.slug === slug
        );

        if (!integration) throw new Error("Integration not found");
        await Integration.updateOne(
          { integrationId: integration.id },
          {
            $set: {
              integrationId: integration.id,
              name: integration.name,
              slug: integration.slug,
              oauthProvider: provider,
              authData: {},
              organisationId,
              ...restInput,
            },
          },
          { upsert: true }
        );

        const client = new AuthorizationCode(getOauth2Config(input));

        const isAzureAD = slug === "azure-ad";
        const isAzureCloud = slug === "azure-cloud";

        const authorizationUri = client.authorizeURL({
          // Abiola
          // redirect_uri: `${"http://localhost:3000"}/api/integrations/callback/${provider.toLowerCase()}_${slug}`,
          redirect_uri: `${
            Resource.cybermap.url || "http://localhost:3000"
          }/api/integrations/callback/${provider.toLowerCase()}`,
          scope: isAzureAD ? MICROSOFT_OAUTH_SCOPE : MICROSOFT_OAUTH_ARM_SCOPE,
        });

        return { url: authorizationUri };
      }),
  }),
});
