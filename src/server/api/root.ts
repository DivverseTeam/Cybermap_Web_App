import { userRouter } from "~/server/api/routers/user";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { generalRouter } from "~/server/api/routers/general";
import { controlsRouter } from "~/server/api/routers/controls";
import { frameworksRouter } from "~/server/api/routers/frameworks";
import { integrationsRouter } from "~/server/api/routers/integrations";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  general: generalRouter,
  controls: controlsRouter,
  frameworks: frameworksRouter,
  integrations: integrationsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
