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
import User from "~/server/models/User";
import { signIn, signUp } from "./actions";
import {
  CodeMismatchException,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ExpiredCodeException,
  ForgotPasswordCommand,
  UserNotFoundException,
} from "@aws-sdk/client-cognito-identity-provider";
import { Resource } from "sst";
import { FrameworkName } from "~/lib/types";
import { controls } from "~/lib/constants/controls";
import Control from "~/server/models/Control";
import { getInformationSecurityPolicies } from "./controls/iso27001/informationSecurityPolicies/aws";

const cognitoClient = new CognitoIdentityProviderClient();

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

  forgotPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const command = new ForgotPasswordCommand({
          ClientId: Resource["user-client"].id,
          Username: input.email,
        });

        await cognitoClient.send(command);
      } catch (error) {
        if (error instanceof UserNotFoundException) {
          throw new Error("Email address is not registered");
        } else {
          throw new Error(
            "Failed to send password reset email. Please try again.",
          );
        }
      }
    }),
  resetPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        verificationCode: z.string(),
        newPassword: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { email, verificationCode, newPassword } = input;

      try {
        const command = new ConfirmForgotPasswordCommand({
          ClientId: Resource["user-client"].id,
          Username: email,
          ConfirmationCode: verificationCode,
          Password: newPassword,
        });

        await cognitoClient.send(command);
      } catch (error) {
        if (error instanceof CodeMismatchException) {
          throw new Error("Invalid reset code");
        } else if (error instanceof ExpiredCodeException) {
          throw new Error("Password reset code expired");
        } else {
          throw new Error(
            "Failed to send password reset email. Please try again.",
          );
        }
      }
    }),
});
