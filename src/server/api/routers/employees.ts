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
          message: `${
            result.upsertedCount < 1
              ? "All provided employees already exist."
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
      const employees = await Employee.find({ organisationId });

      // return EmployeeType.array().parse(employees);
      return employees;
    } catch (error) {
      console.log(error);
    }
  }),
});
