import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import Organisation from "~/server/models/Organisation";
import { integrations } from "~/lib/constants/integrations";
import { z } from "zod";
import { Oauth2Provider } from "~/lib/types/integrations";

export const integrationsRouter = createTRPCRouter({
  getAllIntegrations: publicProcedure.query(({ ctx: _ }) => {
    return integrations;
  }),

  getIntegrations: protectedProcedure.query(async ({ ctx }) => {
    const {
      session: {
        user: { organisationId },
      },
    } = ctx;

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let organisationIntegrations: Array<any> = [];

    if (organisationId) {
      const organisation =
        await Organisation.findById(organisationId).select("integrations");
      organisationIntegrations = organisation?.integrations || [];
    }

    const connectedIntegrationIds = new Set(
      organisationIntegrations.map((integration) => integration.id),
    );

    const connectedIntegrations = integrations.filter((integration) =>
      connectedIntegrationIds.has(integration.id),
    );

    const nonConnectedIntegrations = integrations.filter(
      (integration) => !connectedIntegrationIds.has(integration.id),
    );

    return {
      connectedIntegrations,
      nonConnectedIntegrations,
    };
  }),

  getConnectedIntegrations: protectedProcedure.query(async ({ ctx }) => {
    const {
      session: {
        user: { organisationId },
      },
    } = ctx;

    const organisation =
      await Organisation.findById(organisationId).select("integrations");

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

      let integrationIds: Array<string> = [];

      if (provider) {
        integrationIds = integrations
          .filter((integration) => integration?.oauthProvider === provider)
          .map((integration) => integration.id);
      } else {
        integrationIds = [integrationId];
      }

      const organisation =
        await Organisation.findById(organisationId).select("integrations");

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
