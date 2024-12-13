import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import Employee, { EmployeeType } from "~/server/models/Employee";
import { z } from "zod";
import Integration from "~/server/models/Integration";
import { azureCloudSlug } from "~/lib/types/integrations";
import { initializeAzureClient } from "./integrations/azure/init";
import { listUsers } from "./integrations/azure/common";

export const employeesRouter = createTRPCRouter({
  addEmployees: protectedProcedure
    .input(z.array(EmployeeType))
    .mutation(async ({ input, ctx }) => {
      const {
        session: {
          user: { organisationId },
        },
      } = ctx;

      if (!organisationId) {
        throw new Error("Organisation not found");
      }
      try {
        // Add organisationId to each employee
        const employeesWithOrgId = input.map((employee) => ({
          ...employee,
          organisationId, // Add organisationId from context
        }));

        // Create bulk operations for upsert
        const newEmployees = employeesWithOrgId.map((employee) => ({
          updateOne: {
            filter: { email: employee.email }, // Match by employeeId
            update: { $setOnInsert: employee }, // Only insert new employees
            upsert: true, // Insert if not found
          },
        }));

        // Execute bulkWrite
        // Insert employees into the database
        const result = await Employee.bulkWrite(newEmployees);
        return {
          message: `${
            result.upsertedCount < 1
              ? "All provided employees already exist on Cybermap"
              : result.upsertedCount === 1
              ? "1 new employee added successfully!"
              : `${result.upsertedCount} new employees added successfully!`
          }`,
        };
      } catch (error) {
        console.log(error);
      }
    }),
  getEmployees: protectedProcedure.query(async ({ ctx }) => {
    const {
      session: {
        user: { organisationId },
      },
    } = ctx;

    if (!organisationId) {
      throw new Error("Organisation not found");
    }
    console.log("organisayion ID:", organisationId);

    try {
      const employees = await Employee.find({ organisationId }).sort({
        firstName: 1,
      });

      // return EmployeeType.array().parse(employees);
      return employees;
    } catch (error) {
      console.log(error);
    }
  }),
  getAzureUsers: protectedProcedure.query(async ({ ctx }) => {
    const {
      session: {
        user: { organisationId },
      },
    } = ctx;

    if (!organisationId) {
      throw new Error("Organisation not found");
    }
    console.log("organisayion ID:", organisationId);

    try {
      const orgIntegration = await Integration.findOne(
        {
          organisationId: organisationId,
          slug: azureCloudSlug.Enum["azure-ad"],
        },
        "authData subscriptionId"
      ).lean();
      if (!orgIntegration?.authData)
        throw new Error(`Integration to Azure not found`);
      const azureClient = await initializeAzureClient(
        orgIntegration.authData.accessToken
      );
      const users = await listUsers(azureClient);
      return users.value;
    } catch (error) {
      console.log(error);
    }
  }),
});
