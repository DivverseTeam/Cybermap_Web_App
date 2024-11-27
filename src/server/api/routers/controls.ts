import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import Control, { OrganisationControl } from "~/server/models/Control";

export const controlsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const {
      session: {
        user: { organisationId },
      },
    } = ctx;

    if (!organisationId) {
      throw new Error("Organisation not found");
    }

    const controls = await Control.find({ organisationId });

    return OrganisationControl.array().parse(controls);
  }),
});
