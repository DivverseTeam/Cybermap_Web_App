import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";
import { generalRouter } from "./general";

export const appRouter = createTRPCRouter({
  user: userRouter,
  general: generalRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
