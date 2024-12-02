import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import Employee, { EmployeeType } from "~/server/models/Employee";
import { z } from "zod";

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
            update: { $set: employee }, // Update fields
            upsert: true, // Insert if not found
          },
        }));

        // Execute bulkWrite
        // Insert employees into the database
        const result = await Employee.bulkWrite(newEmployees);
        return {
          message: `${result.upsertedCount} new ${
            result.upsertedCount > 1 ? "employees" : "employee"
          } added successfully.`,
        };
      } catch (error) {
        console.log(error);
      }
    }),
});
