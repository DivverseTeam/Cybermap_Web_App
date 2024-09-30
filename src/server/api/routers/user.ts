import { z } from "zod";
import { UserRole } from "~/lib/types";
import bcrypt from "bcrypt";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";
import User from "~/server/models/User";

export const userRouter = createTRPCRouter({
	signUp: publicProcedure
		.input(
			z.object({
				name: z.string(),
				email: z.string(),
				password: z.string(),
				role: UserRole,
			}),
		)
		.mutation(async ({ ctx: _, input }) => {
			const { name, email, role, password } = input;

			const isEmailTaken = await User.findOne({ email });

			if (isEmailTaken) {
				throw new Error("Email is already taken");
			}

			const hashPassword = bcrypt.hashSync(password, 12);
			let user = await User.create({
				name,
				email,
				role,
				password: hashPassword,
			});

			// TODO: Create token and return a token?
			user = user.toObject();

			return user;
		}),

	getSecretMessage: protectedProcedure.query(() => {
		return "you can now see this secret message!";
	}),
});
