import { z } from "zod";
import { PRESIGNED_URL_TYPES } from "~/lib/types";

import mongoose from "mongoose";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Resource } from "sst";
import { AuthorizationCode } from "simple-oauth2";
import { Oauth2Provider } from "~/lib/types/integrations";

import { env } from "~/env";
import {
  MICROSOFT_OAUTH_SCOPE,
  Oauth2ProviderConfigMap,
} from "~/server/constants/integrations";

export const generalRouter = createTRPCRouter({
  getS3PresignedUrl: protectedProcedure
    .input(
      z.object({
        type: z.enum([...PRESIGNED_URL_TYPES]),
        fileType: z.string(),
        id: z.string().optional(),
      }),
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
      .input(Oauth2Provider)
      .mutation(({ input: provider }) => {
        const client = new AuthorizationCode(Oauth2ProviderConfigMap[provider]);

        const authorizationUri = client.authorizeURL({
          redirect_uri: `${env.BASE_URL || "http://localhost:3000"}/api/integrations/callback/${provider.toLowerCase()}`,
          scope: MICROSOFT_OAUTH_SCOPE,
        });

        return { url: authorizationUri };
      }),
  }),
});
