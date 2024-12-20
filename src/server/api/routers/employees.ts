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
        // Define the default compliance list with all compliances set to false
        const defaultComplianceList = [
          { "Policy Acknowledgement": false },
          { "Identity MFA": false },
          { "Background Check": false },
          { "Security Training": false },
          { "Device Compliance": false },
          { "Password Managers": false },
          { "Anti-Virus": false },
          { "Auto-Updates": false },
        ];

        // Add organisationId to each employee
        const modifiedEmployees = input.map((employee) => ({
          ...employee,
          organisationId, // Add organisationId from context
          complianceList: defaultComplianceList, // Add the default compliance list
        }));

        // Create bulk operations for upsert
        const newEmployees = modifiedEmployees.map((employee) => ({
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
    console.log("organisation ID from get employees:", organisationId);

    try {
      const employees = await Employee.find({ organisationId }).sort({
        firstName: 1,
      });

      // Convert `_id` to string for each employee
      const transformedEmployees = employees.map((employee) => ({
        ...employee.toObject(), // Convert Mongoose document to plain object
        _id: employee._id.toString(), // Ensure `_id` is a string
      }));

      return EmployeeType.array().parse(transformedEmployees); // return employees;
    } catch (error) {
      console.log(error);
    }
  }),

  changeComplianceStatus: protectedProcedure
    .input(
      z.object({
        _id: z.string(), // The MongoDB ObjectId of the employee
        newComplianceList: z.array(z.record(z.boolean().optional())).optional(),
      })
    )
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
        const { _id, newComplianceList } = input;

        // const employeeObjectId = new ObjectId(_id);

        // Transform the newComplianceList into a format MongoDB can use
        // const formattedComplianceList = newComplianceList.map(
        //   ({ key, value }) => ({
        //     [key]: value,
        //   })
        // );

        // Update the complianceList of the employee
        const result = await Employee.updateOne(
          { _id, organisationId }, // Match employee by ObjectId and organisationId
          { $set: { complianceList: newComplianceList } } // Replace the complianceList
        );

        if (result.matchedCount === 0) {
          throw new Error(
            "Employee not found or does not belong to this organisation"
          );
        }

        return {
          message: "Compliance list updated successfully",
          updatedCount: result.modifiedCount,
        };
      } catch (error) {
        console.error("Error updating compliance list:", error);
        throw new Error("Failed to update compliance list");
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
    console.log("organisation ID:", organisationId);

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

      console.log("azure users data: ", users.value);

      // Modify users and add to employees collection in database
      // ...

      return users.value;
    } catch (error) {
      console.log(error);
    }
  }),
});
