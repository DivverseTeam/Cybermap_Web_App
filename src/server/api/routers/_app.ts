import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";
import { generalRouter } from "~/server/api/routers/general";
import { controlsRouter } from "~/server/api/routers/controls";
import { integrationsRouter } from "~/server/api/routers/integrations";
import { frameworksRouter } from "~/server/api/routers/frameworks";
import { employeesRouter } from "~/server/api/routers/employees";

export const appRouter = createTRPCRouter({
  user: userRouter,
  general: generalRouter,
  controls: controlsRouter,
  frameworks: frameworksRouter,
  integrations: integrationsRouter,
  employees: employeesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
