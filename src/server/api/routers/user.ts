import { z } from "zod";
import { UserRole } from "~/lib/types";
import bcrypt from "bcrypt";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";
import User from "~/server/models/User";
import Organisation, {
	OrganisationIndustry,
	OrganisationKind,
	OrganisationSize,
} from "~/server/models/Organisation";
import mongoose from "mongoose";

export const userRouter = createTRPCRouter({
	signUp: publicProcedure
		.input(
			z.object({
				name: z.string(),
				email: z.string(),
				password: z.string(),
				role: UserRole.default("ADMIN"),
				organisation: z.object({
					logo: z.any(),
					name: z.string(),
					size: OrganisationSize,
					kind: OrganisationKind,
					industry: OrganisationIndustry,
					frameworks: z.array(z.string()).optional(),
					integrations: z.array(z.string()).optional(),
				}),
			}),
		)
		.mutation(async ({ ctx: _, input }) => {
			const { name, email, role, password, organisation } = input;

			const isEmailTaken = await User.findOne({ email });

			if (isEmailTaken) {
				throw new Error("Email is already taken");
			}

			const { logo, ...restOrganisation } = organisation;

			// TODO: Upload logo file to blob storage and get a publicly accessible logoUrl
			const organisationId = new mongoose.Types.ObjectId().toString();
			const hashPassword = bcrypt.hashSync(password, 12);

			let [user, _createdOrganisation] = await Promise.all([
				User.create({
					name,
					email,
					role,
					password: hashPassword,
					organisationId,
				}),
				Organisation.create({
					_id: organisationId,
					...restOrganisation,
					logoUrl: "",
				}),
			]);

			user = user.toObject();

			return user;
		}),

	getSecretMessage: protectedProcedure.query(() => {
		return "you can now see this secret message!";
	}),
});
