import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { integrations } from "~/lib/constants/integrations";
import { z } from "zod";
import { type Integration, Oauth2Provider } from "~/lib/types/integrations";
import OrganisationIntegration from "~/server/models/Integration";

export const integrationsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const {
      session: {
        user: { organisationId },
      },
    } = ctx;

    const organisationIntegrations =
      (await OrganisationIntegration.find({ organisationId })) || [];

    const connectedIntegrationIds = new Set(
      organisationIntegrations.map((integration) => integration.integrationId),
    );

    const allIntegrations: Array<Integration & { isConnected: boolean }> = [];
    const connected: Array<Integration & { isConnected: boolean }> = [];

    for (const integration of integrations) {
      if (connectedIntegrationIds.has(integration.id)) {
        allIntegrations.push({ ...integration, isConnected: true });
        connected.push({ ...integration, isConnected: true });
      } else {
        allIntegrations.push({ ...integration, isConnected: false });
      }
    }

    return {
      connected,
      all: allIntegrations,
    };
  }),

  disconnect: protectedProcedure
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

      let integrationIds: Array<string> = [];

      if (provider) {
        integrationIds = integrations
          .filter((integration) => integration?.oauthProvider === provider)
          .map((integration) => integration.id);
      } else {
        integrationIds = [integrationId];
      }

      await OrganisationIntegration.deleteMany({
        organisationId,
        integrationId: { $in: integrationIds },
      });
    }),
});
