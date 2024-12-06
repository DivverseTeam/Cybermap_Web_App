import { z } from "zod";
import { PRESIGNED_URL_TYPES } from "~/lib/types";

import mongoose from "mongoose";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  DeleteObjectCommand,
  GetObjectAttributesCommand,
  GetObjectCommand,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Resource } from "sst";
import { AuthorizationCode } from "simple-oauth2";

import {
  getOauth2Config,
  MICROSOFT_OAUTH_SCOPE,
} from "~/server/constants/integrations";
import { integrations } from "~/lib/constants/integrations";
import Integration from "~/server/models/Integration";
import { env } from "~/env";

export const IntegrationOauth2Props = z.union([
  z.object({
    provider: z.literal("MICROSOFT"),
    tenantId: z.string().uuid(),
    subscriptionId: z.string().uuid(),
    workspaceId: z.string().optional(),
  }),
  z.object({
    provider: z.literal("GOOGLE"),
    projectId: z.string(),
  }),
]);

export type IntegrationOauth2Props = z.infer<typeof IntegrationOauth2Props>;

export const generalRouter = createTRPCRouter({
  getS3PresignedUrl: protectedProcedure
    .input(
      z.object({
        type: z.enum([...PRESIGNED_URL_TYPES]),
        fileType: z.string().optional(),
        id: z.string().optional(),
        objectKey: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { type, fileType } = input;

      const id = input?.id || new mongoose.Types.ObjectId().toString();

      const client = new S3Client({});

      let bucket: string = Resource.images.name;

      let key: string = id;

      if (type === "ORGANISATION_LOGO") {
        key = `media/organisation_logos/${id}`;
      }

      if (type === "POLICY_DOCUMENT") {
        bucket = Resource["policy-documents"].name;
        key = input?.objectKey || "";
      }

      const command = new PutObjectCommand({
        Bucket: bucket,
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

  getPolicyDocument: protectedProcedure
    .input(
      z.object({
        framework: z.string(),
        slug: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { framework, slug } = input;
      const { organisationId = "" } = ctx.session.user;

      const client = new S3Client({});

      let documentSize = 0;
      let hasDocument = false;

      try {
        const objectResponse = await client.send(
          new GetObjectAttributesCommand({
            Bucket: Resource["policy-documents"].name,
            Key: `${organisationId}/${framework}/${slug}`,
            ObjectAttributes: ["ObjectSize"],
          }),
        );
        hasDocument = true;
        documentSize = objectResponse.ObjectSize || 0;
      } catch (error) {
        console.log(error);
      }

      return {
        hasDocument,
        documentSize,
      };
    }),

  deletePolicyDocument: protectedProcedure
    .input(
      z.object({
        framework: z.string(),
        slug: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { slug, framework } = input;
      const { organisationId = "" } = ctx.session.user;

      const client = new S3Client({});

      await client.send(
        new DeleteObjectCommand({
          Bucket: Resource["policy-documents"].name,
          Key: `${organisationId}/${framework}/${slug}`,
        }),
      );
    }),

  oauth2: createTRPCRouter({
    authorization: protectedProcedure
      .input(IntegrationOauth2Props)
      .mutation(async ({ input, ctx }) => {
        const { provider, ...restInput } = input;

        const {
          session: {
            user: { organisationId },
          },
        } = ctx;

        if (!organisationId) {
          throw new Error("No organisation found");
        }

        const upsertPromises: Array<Promise<unknown>> = [];

        integrations
          .filter((integration) => integration?.oauthProvider === provider)
          .forEach((integration) => {
            upsertPromises.push(
              Integration.updateOne(
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
                { upsert: true },
              ),
            );
          });

        await Promise.all(upsertPromises);

        const client = new AuthorizationCode(getOauth2Config(input));

        const authorizationUri = client.authorizeURL({
          redirect_uri: `${env.BASE_URL || "http://localhost:3000"}/api/integrations/callback/${provider.toLowerCase()}`,
          scope: MICROSOFT_OAUTH_SCOPE,
        });

        return { url: authorizationUri };
      }),
  }),
});
