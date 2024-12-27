import mongoose from "mongoose";
import { ControlStatus } from "~/lib/types/controls";

const OrgControlsMappingAggregation = (organisationId: string) => {
  return [
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
  ];
};

export { OrgControlsMappingAggregation };
