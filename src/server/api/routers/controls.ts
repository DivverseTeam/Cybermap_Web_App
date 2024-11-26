import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import Organisation from "~/server/models/Organisation";
import { controls } from "~/lib/constants/controls";
import Evidence from "~/server/models/Evidence";
import type { OrganisationControl } from "~/lib/types/controls";

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

    const organisation =
      await Organisation.findById(organisationId).select("frameworks");

    if (!organisation) {
      throw new Error("Organisation not found");
    }

    const frameworks = organisation.frameworks;

    const organisationControls = controls.filter((control) =>
      control.mapped.some((framework) => frameworks.includes(framework)),
    );

    const controlCodes = organisationControls.map((control) => control.code);

    const evidences = await Evidence.find({
      codes: { $in: controlCodes },
      organisationId,
    }).select("codes status feedback");

    const evidenceMap = new Map<string, (typeof evidences)[0]>();
    evidences.forEach((evidence) => {
      evidence.codes.forEach((code) => {
        if (!evidenceMap.has(code)) {
          evidenceMap.set(code, evidence);
        }
      });
    });

    const organisationControlWithFeedback: Array<OrganisationControl> =
      organisationControls.map((control) => {
        const evidence = evidenceMap.get(control.code);

        return {
          ...control,
          status: evidence?.feedback || "NOT_IMPLEMENTED",
        };
      });

    return organisationControlWithFeedback;
  }),
});
