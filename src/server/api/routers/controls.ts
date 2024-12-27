import mongoose from "mongoose";
import { ControlStatus } from "~/lib/types/controls";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import Control, { OrganisationControl } from "~/server/models/Control";
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

    const controls = await Control.aggregate([
      {
        $lookup: {
          from: "orgcontrolmappings",
          localField: "_id",
          foreignField: "controlId",
          as: "orgMapping",
        },
      },
      {
        $unwind: {
          path: "$orgMapping",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            {
              "orgMapping.organisationId": new mongoose.Types.ObjectId(
                organisationId
              ),
            },
            { orgMapping: null },
          ],
        },
      },
      {
        $project: {
          id: 1,
          name: 1,
          code: 1,
          mapped: 1,
          organisationId: "$orgMapping.organisationId",
          status: {
            $ifNull: ["$orgMapping.status", ControlStatus.Enum.NOT_IMPLEMENTED],
          },
        },
      },
    ]);
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
