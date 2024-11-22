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
import { signIn, signUp } from "./actions";
import { getInformationSecurityPolicies } from "./controls/iso27001/informationSecurityPolicies/aws";

export const SignInProps = z.object({
  email: z.string(),
  password: z.string(),
});

export type SignInProps = z.infer<typeof SignInProps>;

export const SignUpProps = SignInProps.extend({
  name: z.string(),
  role: UserRole.default("ADMIN"),
});

export type SignUpProps = z.infer<typeof SignUpProps>;

export const userRouter = createTRPCRouter({
  test: publicProcedure
    .query(async ({ ctx: _,}) => {
      return await getInformationSecurityPolicies();
    }),
  
  signUp: publicProcedure
    .input(SignUpProps)
    .mutation(async ({ ctx: _, input }) => {
      return await signUp(input);
    }),

  signIn: publicProcedure
    .input(SignInProps)
    .mutation(async ({ ctx: _, input }) => {
      return await signIn(input);
    }),

  completeOnboarding: protectedProcedure
    .input(
      z.object({
        logoUrl: z.any(),
        name: z.string(),
        size: OrganisationSize,
        kind: OrganisationKind,
        industry: OrganisationIndustry,
        frameworkIds: z.array(z.string()).optional(),
        integrations: z.array(z.any()).optional(),
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
