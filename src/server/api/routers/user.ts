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
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ForgotPasswordCommand,
  GetUserCommand,
  ResendConfirmationCodeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { Resource } from "sst";
import jwt, { type JwtHeader } from "jsonwebtoken";

// Initialize the Cognito client
const cognitoClient = new CognitoIdentityProviderClient();

// Schema for the `verifyEmail` input
const VerifyEmailInput = z.object({
  token: z.string(), // JWT token
});

// Fetch the public key from the Cognito JWK endpoint
interface Jwk {
  kid: string;
  x5c: string[];
  alg: string;
  use: string;
  n: string;
  e: string;
}

interface JwkSet {
  keys: Jwk[];
}

// Input validation schema for the resend verification procedure
const ResendVerificationCodeProps = z.object({
  email: z.string().email(),
});

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

  verifyEmail: publicProcedure
    .input(VerifyEmailInput)
    .mutation(async ({ input }) => {
      const { token } = input;

      try {
        const userPoolId = Resource.user.id; // Access UserPool ID from SST Resource
        const region = process.env.AWS_REGION || "us-east-1";

        if (!userPoolId || !region) {
          throw new Error("User Pool ID or Region is missing.");
        }

        // Get public keys from Cognito's JWK endpoint
        async function getPublicKey(
          userPoolId: string,
          region: string
        ): Promise<Jwk[]> {
          const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
          const response = await fetch(jwksUrl);
          const data = (await response.json()) as JwkSet;
          return data.keys;
        }
        const keys = await getPublicKey(userPoolId, region);

        // Decode the JWT header to extract the Key ID (kid)
        const decodedHeader = jwt.decode(token, { complete: true }) as {
          header: JwtHeader;
        } | null;

        if (!decodedHeader || !decodedHeader.header.kid) {
          throw new Error("Invalid JWT header.");
        }

        const key = keys.find((k) => k.kid === decodedHeader.header.kid);

        if (!key) {
          throw new Error("Unable to find a matching key.");
        }

        // Construct the public key
        const publicKey = `-----BEGIN PUBLIC KEY-----\n${key.x5c[0]}\n-----END PUBLIC KEY-----`;

        // Verify the JWT using the public key
        const decoded = jwt.verify(token, publicKey) as {
          email: string;
          sub: string;
        };

        const { email, sub } = decoded;

        if (!email || !sub) {
          throw new Error("Missing required fields in token.");
        }

        // Update the user's email_verified attribute in Cognito
        const command = new AdminUpdateUserAttributesCommand({
          UserPoolId: userPoolId,
          Username: sub,
          UserAttributes: [{ Name: "email_verified", Value: "true" }],
        });

        await cognitoClient.send(command);

        return {
          success: true,
          message: "Email verified successfully.",
        };
      } catch (error) {
        console.error("Error verifying email:", error);
        throw new Error("Failed to verify email. Please try again.");
      }
    }),

  resendVerificationCode: publicProcedure
    .input(ResendVerificationCodeProps)
    .mutation(async ({ input }) => {
      const { email } = input;

      try {
        const command = new ResendConfirmationCodeCommand({
          ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID!,
          Username: email,
        });

        await cognitoClient.send(command);

        return { message: "Verification email sent successfully" };
      } catch (error) {
        console.error("Failed to resend verification email:", error);
        throw new Error(
          "Unable to resend verification email. Please try again."
        );
      }
    }),

  checkEmailVerified: protectedProcedure
    .input(
      z.object({
        accessToken: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { accessToken } = input;

      try {
        const command = new GetUserCommand({ AccessToken: accessToken });
        const response = await cognitoClient.send(command);

        const emailVerified = response.UserAttributes?.find(
          (attr) => attr.Name === "email_verified"
        )?.Value;

        return { emailVerified: emailVerified === "true" };
      } catch (error) {
        console.error("Failed to fetch user attributes:", error);
        throw new Error("Failed to fetch user attributes. Please try again.");
      }
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
          message:
            "Password reset email sent successfully. Please check your inbox.",
        };
      } catch (error) {
        console.error("Error initiating forgot password:", error);

        return {
          success: false,
          message: "Failed to initiate password reset.",
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
