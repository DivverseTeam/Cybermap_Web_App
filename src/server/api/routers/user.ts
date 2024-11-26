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
import { FrameworkName } from "~/lib/types";

import { controls } from "~/lib/constants/controls";
import Control, { OrganisationControl } from "~/server/models/Control";

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
        frameworks: z.array(FrameworkName).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const {
        session: {
          user: { id: userId },
        },
      } = ctx;
      const { frameworks = [] } = input;

      const organisationId = new mongoose.Types.ObjectId().toString();

      const upsertControlsPromises: Array<Promise<unknown>> = [];

      controls.forEach((control) => {
        if (
          control.mapped.some((framework) => frameworks.includes(framework))
        ) {
          upsertControlsPromises.push(
            Control.updateOne(
              {
                code: control.code,
              },
              {
                $set: {
                  ...control,
                  organisationId,
                  status: "NOT_IMPLEMENTED",
                },
              },
              { upsert: true },
            ),
          );
        }
      });

      const [_, updatedUser] = await Promise.all([
        Organisation.create({
          _id: organisationId,
          ...input,
        }),
        User.findByIdAndUpdate(userId, { organisationId }, { new: true }),
        ...upsertControlsPromises,
      ]);

      return updatedUser?.toObject();
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
