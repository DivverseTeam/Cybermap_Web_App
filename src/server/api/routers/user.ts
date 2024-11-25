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
import {
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { Resource } from "sst";

// Initialize the Cognito client
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
      })
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

  forgotPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(), // Validate email
      })
    )
    .mutation(async ({ input }) => {
      try {
        const command = new ForgotPasswordCommand({
          ClientId: Resource["user-client"].id, // Replace with your Cognito App Client ID
          Username: input.email,
        });

        await cognitoClient.send(command);

        return {
          success: true,
          message: "A password reset code has been sent your mail.",
        };
      } catch (error) {
        console.error("Error initiating forgot password:", error);

        return {
          success: false,
          message: "Failed to initiate password reset. Try again later",
        };
      }
    }),
  resetPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        verificationCode: z.string(),
        newPassword: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { email, verificationCode, newPassword } = input;

      try {
        // Send the Cognito ConfirmForgotPasswordCommand
        const command = new ConfirmForgotPasswordCommand({
          ClientId: Resource["user-client"].id, // Replace with your Cognito App Client ID
          Username: email,
          ConfirmationCode: verificationCode,
          Password: newPassword,
        });

        await cognitoClient.send(command);

        return {
          success: true,
          message: "Your password has been reset successfully.",
        };
      } catch (error) {
        console.error("Error confirming forgot password:", error);
        throw new Error("Failed to reset password. Please try again.");
      }
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
