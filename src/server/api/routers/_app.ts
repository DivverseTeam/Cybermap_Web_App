import { Resource } from "sst";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { postRouter } from "~/server/api/routers/post";
import { userRouter } from "~/server/api/routers/user";
import { z } from "zod";
import { PRESIGNED_URL_TYPES } from "~/lib/types";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "~/env";
import mongoose from "mongoose";

export const appRouter = createTRPCRouter({
	post: postRouter,
	user: userRouter,
	example: createTRPCRouter({
		hello: publicProcedure
			.input(z.object({ text: z.string().nullish() }).nullish())
			.query(({ input }) => {
				return {
					greeting: `Hello ${input?.text ?? "world"}`,
				};
			}),

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

				if (type === "ORGANIZATION_LOGO") {
					key = `media/organization_logos/${id}`;
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
