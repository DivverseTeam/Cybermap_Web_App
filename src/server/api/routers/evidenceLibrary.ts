import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import EvidenceLibraryModel, {
  EvidenceLibrary,
} from "~/server/models/EvidenceLibrary";

export const evidenceLibraryRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const {
      session: {
        user: { organisationId },
      },
    } = ctx;

    if (!organisationId) {
      throw new Error("Organisation not found");
    }
    console.log("organisation ID from get employees:", organisationId);

    try {
      const evidences = await EvidenceLibraryModel.find({ organisationId })
        .lean()
        .sort("createdAt");
      return EvidenceLibrary.array().parse(evidences);
    } catch (error) {
      console.log(error);
    }
  }),
});
