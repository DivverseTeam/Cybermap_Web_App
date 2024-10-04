import { z } from "zod";
import {
	OrganizationIndustry,
	OrganizationKind,
	OrganizationSize,
	UserRole,
} from "~/lib/types";
import bcrypt from "bcrypt";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";
import User from "~/server/models/User";
import Organization from "~/server/models/Organization";
import mongoose from "mongoose";

export const userRouter = createTRPCRouter({
	signUp: publicProcedure
		.input(
			z.object({
				name: z.string(),
				email: z.string(),
				password: z.string(),
				role: UserRole.default("ADMIN"),
				organization: z.object({
					logoUrl: z.any(),
					name: z.string(),
					size: OrganizationSize,
					kind: OrganizationKind,
					industry: OrganizationIndustry,
					frameworks: z.array(z.string()).optional(),
					integrations: z.array(z.string()).optional(),
				}),
			}),
		)
		.mutation(async ({ ctx: _, input }) => {
			const { name, email, role, password, organization } = input;

			const isEmailTaken = await User.findOne({ email });

			if (isEmailTaken) {
				throw new Error("Email is already taken");
			}

			const organizationId = new mongoose.Types.ObjectId().toString();
			const hashPassword = bcrypt.hashSync(password, 12);

			let [user, _createdOrganization] = await Promise.all([
				User.create({
					name,
					email,
					role,
					password: hashPassword,
					organizationId,
				}),
				Organization.create({
					_id: organizationId,
					...organization,
				}),
			]);

			user = user.toObject();

			return user;
		}),

	signIn: publicProcedure
		.input(
			z.object({
				email: z.string(),
				password: z.string(),
			}),
		)
		.mutation(async ({ ctx: _, input }) => {
			const { email, password } = input;

			const user = await User.findOne({ email });

			const isPasswordCorrect = user?.get("password")
				? bcrypt.compareSync(password, user.get("password"))
				: false;

			if (!user || !isPasswordCorrect) {
				throw new Error("Invalid email or password");
			}

			return user.toObject();
		}),

	getSecretMessage: protectedProcedure.query(() => {
		return "you can now see this secret message!";
	}),
});
