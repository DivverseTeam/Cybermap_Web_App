import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";
import { generalRouter } from "~/server/api/routers/general";
import { integrationsRouter } from "~/server/api/routers/integrations";

export const appRouter = createTRPCRouter({
  user: userRouter,
  general: generalRouter,
  integrations: integrationsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
