import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  default as Control,
  default as ControlModel,
  OrganisationControl,
} from "~/server/models/Control";
import {
  OrgControlsMappingAggregation,
  OrgControlsMappingByIntegrationAggregation,
} from "./common";
import { getEvidencesForOrganization } from "./integrations/common";

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

    try {
      const aggregation = OrgControlsMappingAggregation(organisationId);
      const controls: OrganisationControl[] = await ControlModel.aggregate(
        aggregation
      );
      const transformedEmployees = controls.map((control) => ({
        ...control,
        _id: control._id.toString(),
      }));

      return OrganisationControl.array().parse(transformedEmployees);
    } catch (error: any) {
      console.log("get controls error", error.message);
      return []
    }
  }),

  getUserControls: protectedProcedure.query(async ({ ctx }) => {
    const {
      session: {
        user: { organisationId },
      },
    } = ctx;

    if (!organisationId) {
      throw new Error("Organisation not found");
    }
    const aggregation = OrgControlsMappingAggregation(organisationId);

    const controls: OrganisationControl[] = await Control.aggregate(
      aggregation
    );
    const transformedEmployees = controls.map((control) => ({
      ...control,
      _id: control._id.toString(),
    }));
    // console.log("transformedEmployees", transformedEmployees);

    return transformedEmployees;
  }),

  getControlsByIntegration: protectedProcedure
    .input(
      z.object({
        integrationId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const {
        session: {
          user: { organisationId },
        },
      } = ctx;

      if (!organisationId) {
        throw new Error("Organisation not found");
      }
      const aggregation = OrgControlsMappingByIntegrationAggregation({
        organisationId,
        integrationId: input.integrationId,
      });

      const controls: OrganisationControl[] = await Control.aggregate(
        aggregation
      );
      const transformedControls = controls.map((control) => ({
        ...control,
        _id: control._id.toString(),
      }));

      return transformedControls;
    }),
  getEvidences: protectedProcedure.query(async ({ ctx }) => {
    const {
      session: {
        user: { organisationId },
      },
    } = ctx;

    if (!organisationId) {
      throw new Error("Organisation not found");
    }

    return getEvidencesForOrganization(organisationId);
  }),
});
