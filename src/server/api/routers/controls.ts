import mongoose from "mongoose";
import { ControlStatus } from "~/lib/types/controls";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import Control, { OrganisationControl } from "~/server/models/Control";
import { getEvidencesForOrganization } from "./integrations/common";
import { OrgControlsMappingAggregation } from "./common";

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

    const controls = await Control.aggregate(aggregation);
    return controls;
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
