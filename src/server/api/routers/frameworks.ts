import { z } from "zod";
import { frameworks } from "~/lib/constants/frameworks";
import ISO27001 from "~/lib/constants/frameworks/iso27001";
import type { Course } from "~/lib/types/course";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import ControlModel, { OrganisationControl } from "~/server/models/Control";
import OrganisationModel from "~/server/models/Organisation";
import { OrgControlMapping } from "~/server/models/OrganizationControlMapping";
import { OrgControlsMappingAggregation } from "./common";

const feedbackWeights: Record<string, number> = {
  FULLY_IMPLEMENTED: 1,
  PARTIALLY_IMPLEMENTED: 0.5,
  NOT_IMPLEMENTED: 0,
};

const SLUG_FRAMEWORK_CONTENT_MAP = {
  iso27001: ISO27001,
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
      const organisation = await OrganisationModel.findById(
        organisationId
      ).select("frameworks");

      if (!organisation) {
        throw new Error("Organisation not found");
      }

      const organisationFrameworks = frameworks.filter((framework) =>
        organisation.frameworks.includes(framework.name)
      );

      return organisationFrameworks;
    }
  ),

  getWithSlug: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ input: { slug } }) => {
      const framework = frameworks.find((framework) => framework.slug === slug);

      if (!framework) {
        throw new Error("Framework not found");
      }

      return framework;
    }),

  getWithCompletion: protectedProcedure.query(
    async ({
      ctx: {
        session: {
          user: { organisationId },
        },
      },
    }) => {
      if (!organisationId) {
        throw new Error("Organisation not found");
      }
      const aggregation = OrgControlsMappingAggregation(organisationId);

      const [organisation, controls] = await Promise.all([
        OrganisationModel.findById(organisationId).select(
          "frameworks completedLessons"
        ),
        ControlModel.aggregate(aggregation),
      ]);

      if (!organisation) {
        throw new Error("Organisation not found");
      }

      const organisationFrameworks = frameworks.filter((framework) =>
        organisation.frameworks.includes(framework.name)
      );

      const controlsByFramework = organisationFrameworks.map((framework) => {
        const courseContent =
          SLUG_FRAMEWORK_CONTENT_MAP[
            framework.slug as keyof typeof SLUG_FRAMEWORK_CONTENT_MAP
          ] || [];
        const totalModules = courseContent.flatMap(
          (course) => course.lessons
        ).length;

        return {
          ...framework,
          controls: OrgControlMapping.array()
            .parse(controls)
            .filter(
              (control) =>
                control?.mapped && control.mapped.includes(framework.name)
            ),
          preparedness: {
            completed:
              organisation.completedLessons.get(framework.slug)?.length || 0,
            total: totalModules,
          },
          readiness: {
            completed:
              organisation.completedLessons.get(framework.slug)?.length || 0,
            total: totalModules,
          },
        };
      });

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
            0
          );

          const completionLevel =
            totalControls > 0
              ? (totalCompletionWeight / totalControls) * 100
              : 0;

          return {
            ...framework,
            controls: OrganisationControl.array().parse(controls),
            completionLevel,
            complianceScore,
          };
        }
      );

      return frameworksWithComplianceScore;
    }
  ),

  compliance: createTRPCRouter({
    getCourse: protectedProcedure
      .input(
        z.object({
          slug: z.string(),
        })
      )
      .query(
        async ({
          ctx: {
            session: {
              user: { organisationId },
            },
          },
          input: { slug },
        }) => {
          const courseContent =
            SLUG_FRAMEWORK_CONTENT_MAP[
              slug as keyof typeof SLUG_FRAMEWORK_CONTENT_MAP
            ] || [];

          const organisation = await OrganisationModel.findById(
            organisationId
          ).select("completedLessons");

          if (!organisation) {
            throw new Error("Organisation not found");
          }

          const completedLessons =
            organisation.completedLessons.get(slug) || [];

          const { courseModulesWithCompletion, totalLessons } =
            courseContent.reduce(
              (acc, section) => {
                const updatedLessons = section.lessons.map((lesson) => ({
                  ...lesson,
                  isCompleted: completedLessons.includes(lesson.id),
                }));

                acc.courseModulesWithCompletion.push({
                  ...section,
                  lessons: updatedLessons,
                });

                acc.totalLessons += updatedLessons.length;

                return acc;
              },
              { courseModulesWithCompletion: [] as Course, totalLessons: 0 } // Initial accumulator
            );

          return {
            modules: courseModulesWithCompletion,
            preparedness: {
              total: totalLessons,
              completed: completedLessons.length,
            },
            readiness: {
              total: totalLessons,
              completed: completedLessons.length,
            },
            total: totalLessons,
            completed: completedLessons.length,
          };
        }
      ),

    markLessonCompleted: protectedProcedure
      .input(
        z.object({
          slug: z.string(),
          lessonId: z.number(),
        })
      )
      .mutation(
        async ({
          ctx: {
            session: {
              user: { organisationId },
            },
          },
          input: { slug, lessonId },
        }) => {
          const organisation = await OrganisationModel.findById(
            organisationId
          ).select("completedLessons");

          if (!organisation) {
            throw new Error("Organisation not found");
          }

          const completedLessons =
            organisation.completedLessons.get(slug) || [];

          if (!completedLessons.includes(lessonId)) {
            completedLessons.push(lessonId);

            organisation.completedLessons.set(slug, completedLessons);

            await organisation.save();
          }

          return true;
        }
      ),
  }),
});
