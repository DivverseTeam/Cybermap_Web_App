import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import Organisation from "~/server/models/Organisation";
import {
  integrations,
  Oauth2ProviderIntegrationIdsMap,
} from "~/lib/constants/integrations";
import { z } from "zod";
import { Oauth2Provider } from "~/lib/types/integrations";

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

  disconnectIntegration: protectedProcedure
    .input(
      z.union([
        z.object({
          integrationId: z.string(),
          provider: Oauth2Provider.nullish(),
        }),
        z.object({
          provider: Oauth2Provider,
          integrationId: z.string().nullish(),
        }),
      ]),
    )
    .mutation(async ({ ctx, input: { provider, integrationId } }) => {
      const {
        session: {
          user: { organisationId },
        },
      } = ctx;

      let integrationIds = [];

      if (provider) {
        integrationIds = Oauth2ProviderIntegrationIdsMap[provider];
      } else {
        integrationIds = [integrationId];
      }

      const organisation = await Organisation.findById(organisationId);

      if (!organisation) {
        throw new Error("Organisation not found");
      }

      // Remove integrations matching any ID in the `integrationIds` array
      organisation.integrations = organisation.integrations.filter(
        (integration) => !integrationIds.includes(integration.id),
      );

      await organisation.save();
    }),
});
