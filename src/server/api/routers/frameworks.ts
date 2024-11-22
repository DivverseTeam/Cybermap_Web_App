import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { frameworks } from "~/lib/constants/frameworks";
import Organisation from "~/server/models/Organisation";

export const frameworksRouter = createTRPCRouter({
  getFrameworks: protectedProcedure.query(
    async ({
      ctx: {
        session: {
          user: { organisationId },
        },
      },
    }) => {
      const organisation =
        await Organisation.findById(organisationId).select("frameworks");

      if (!organisation) {
        throw new Error("Organisation not found");
      }

      const organisationFrameworks = frameworks.filter((framework) =>
        organisation.frameworks.includes(framework.name),
      );

      return organisationFrameworks;
    },
  ),
});
