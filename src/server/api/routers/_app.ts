import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { postRouter } from "~/server/api/routers/post";
import { z } from "zod";

export const appRouter = createTRPCRouter({
	post: postRouter,
	example: createTRPCRouter({
		hello: publicProcedure
			.input(z.object({ text: z.string().nullish() }).nullish())
			.query(({ input }) => {
				return {
					greeting: `Hello ${input?.text ?? "world"}`,
				};
			}),
	}),
});

// export type definition of API
export type AppRouter = typeof appRouter;
