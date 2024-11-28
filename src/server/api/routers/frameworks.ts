import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { frameworks } from "~/lib/constants/frameworks";
import Organisation from "~/server/models/Organisation";
import Control from "~/server/models/Control";

const feedbackWeights: Record<string, number> = {
  FULLY_IMPLEMENTED: 1,
  PARTIALLY_IMPLEMENTED: 0.5,
  NOT_IMPLEMENTED: 0,
};

export const frameworksRouter = createTRPCRouter({
  get: protectedProcedure.query(
    async ({
      ctx: {
        session: {
          user: { organisationId },
        },
      },
    }) => {
      const organisation =
        await Organisation.findById(organisationId).select("frameworks");

      if (!organisation) {
        throw new Error("Organisation not found");
      }

      const organisationFrameworks = frameworks.filter((framework) =>
        organisation.frameworks.includes(framework.name),
      );

      return organisationFrameworks;
    },
  ),

  getWithCompletion: protectedProcedure.query(
    async ({
      ctx: {
        session: {
          user: { organisationId },
        },
      },
    }) => {
      const [organisation, controls] = await Promise.all([
        Organisation.findById(organisationId).select("frameworks"),
        Control.find({ organisationId }),
      ]);

      if (!organisation) {
        throw new Error("Organisation not found");
      }

      const organisationFrameworks = frameworks.filter((framework) =>
        organisation.frameworks.includes(framework.name),
      );

      const controlsByFramework = organisationFrameworks.map((framework) => ({
        name: framework.name,
        logo: framework.logo,
        controls: controls.filter((control) =>
          control.mapped.includes(framework.name),
        ),
      }));

      const frameworksWithComplianceScore = controlsByFramework.map(
        (framework) => {
          const totalControls = framework.controls.length;

          // Initialize compliance score counters
          const complianceScore = {
            failing: 0, // NOT_IMPLEMENTED
            passing: 0, // FULLY_IMPLEMENTED
            risk: 0, // PARTIALLY_IMPLEMENTED
          };

          const totalCompletionWeight = framework.controls.reduce(
            (acc, control) => {
              const feedback = control.status;

              if (feedback === "FULLY_IMPLEMENTED") {
                complianceScore.passing += 1;
              } else if (feedback === "PARTIALLY_IMPLEMENTED") {
                complianceScore.risk += 1;
              } else if (feedback === "NOT_IMPLEMENTED") {
                complianceScore.failing += 1;
              }

              return acc + (feedbackWeights[feedback] || 0);
            },
            0,
          );

          const completionLevel =
            totalControls > 0
              ? (totalCompletionWeight / totalControls) * 100
              : 0;

          return {
            name: framework.name,
            logo: framework.logo,
            controls,
            completionLevel,
            complianceScore, // Add compliance score to the result
          };
        },
      );

      return frameworksWithComplianceScore;
    },
  ),
});
