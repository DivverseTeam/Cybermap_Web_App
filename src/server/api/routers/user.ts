// import argon2 from "argon2";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import {
  OrganisationIndustry,
  OrganisationKind,
  OrganisationSize,
  UserRole,
} from "~/lib/types";

import mongoose from "mongoose";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import Organisation from "~/server/models/Organisation";
import User, { User as UserSchema } from "~/server/models/User";
import { signIn } from "./actions";

export const userRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
        role: UserRole.default("ADMIN"),
      }),
    )
    .mutation(async ({ ctx: _, input }) => {
      const { name, email, role, password } = input;

      const isEmailTaken = await User.findOne({ email });

      if (isEmailTaken) {
        throw new Error("Email address is already taken");
      }

      const hashPassword = bcryptjs.hashSync(password, 12);

      let user = await User.create({
        name,
        email,
        role,
        password: hashPassword,
      });

      user = user.toJSON();

      return UserSchema.parse(user);
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

      return await signIn({ email, password });
    }),

  completeOnboarding: protectedProcedure
    .input(
      z.object({
        logoUrl: z.any(),
        name: z.string(),
        size: OrganisationSize,
        kind: OrganisationKind,
        industry: OrganisationIndustry,
        frameworks: z.array(z.string()).optional(),
        integrations: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const {
        session: {
          user: { id: userId },
        },
      } = ctx;

      const organisationId = new mongoose.Types.ObjectId().toString();

      const [_, updatedUser] = await Promise.all([
        Organisation.create({
          _id: organisationId,
          ...input,
        }),
        User.findByIdAndUpdate(userId, { organisationId }, { new: true }),
      ]);

      return updatedUser?.toObject();
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
