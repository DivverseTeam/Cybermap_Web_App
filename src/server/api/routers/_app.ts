import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import mongoose from "mongoose";
import { Resource } from "sst";
import { z } from "zod";
import { PRESIGNED_URL_TYPES } from "~/lib/types";
import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  general: createTRPCRouter({
    getS3PresignedUrl: publicProcedure
      .input(
        z.object({
          type: z.enum([...PRESIGNED_URL_TYPES]),
          fileType: z.string(),
          id: z.string().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const { type, fileType } = input;

        const id = input?.id || mongoose.mongo.ObjectId.toString();

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

        const url = await getSignedUrl(client, command, { expiresIn: 60 });

        return {
          url,
          id,
        };
      }),
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
