import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import mongoose from "mongoose";
import Control, { OrganisationControl } from "~/server/models/Control";
import UserControlMapping from "~/server/models/UserControlMapping";
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

  getUserControls: publicProcedure.query(async ({ ctx }) => {
    const controls = await Control.aggregate([
      {
        $lookup: {
          from: "usercontrolmappings",
          localField: "_id",
          foreignField: "controlId",
          as: "userMapping",
        },
      },
      {
        $unwind: {
          path: "$userMapping",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "userMapping.organisationId": new mongoose.Types.ObjectId(
            "674d8ad4151cbe0486eaf743"
          ),
        },
      },
      {
        $project: {
          id: 1,
          name: 1,
          code: 1,
          mapped: 1,
          organisationId: "$userMapping.organisationId",
          status: "$userMapping.status",
        },
      },
    ]);
    // console.log("controls", controls);
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
