import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import Organisation from "~/server/models/Organisation";
import { integrations } from "~/lib/constants/integrations";

export const integrationsRouter = createTRPCRouter({
  getAllIntegrations: publicProcedure.query(({ ctx: _ }) => {
    return integrations;
  }),
  getConnectedIntegrations: protectedProcedure.query(async ({ ctx }) => {
    const {
      session: {
        user: { organisationId },
      },
    } = ctx;

    const organisation = await Organisation.findById(organisationId);

    const organisationIntegrations = organisation?.integrations || [];

    const connectedIntegrationIds = new Set(
      organisationIntegrations.map((integration) => integration.id),
    );

    return integrations.filter((integration) =>
      connectedIntegrationIds.has(integration.id),
    );
  }),
});
