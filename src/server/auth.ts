import {
  type DefaultSession,
  type NextAuthOptions,
  getServerSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { signIn } from "./api/routers/actions";
import { User } from "./models/User";
import {
  AdminGetUserCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isEmailVerified?: boolean; // Add custom fields here
      token?: string; // Add token if needed
    };
  }
}

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user: User & DefaultSession["user"];
//   }

//   // interface User {
//   //   // ...other properties
//   //   // role: UserRole;
//   // }
// }

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    // This runs when the session is being created or updated
    session: ({ session, token }) => {
      // Add custom attributes to the session
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          organisationId: token.organisationId as string | undefined,
          isEmailVerified: token.isEmailVerified as boolean | undefined,
        },
        accessToken: token.accessToken as string,
      };
    },
    jwt: ({ token, user, account }) => {
      // console.log("JWT before:", token.jti);
      if (account && user) {
        token.id = user.id;
        token.sub = user.id;

        const parsedUser = User.safeParse(user);

        if (parsedUser.success) {
          const { id, role, organisationId } = parsedUser.data;

          // Add fields to the token
          token.id = id;
          token.role = role;
          token.organisationId = organisationId;

          // Add email verification status if provided
          if (parsedUser.data.isEmailVerified !== undefined) {
            token.isEmailVerified = parsedUser.data.isEmailVerified;
          }

          // Add accessToken if available
          if (account.access_token) {
            token.accessToken = account?.access_token;
          }
        }
      }
      // console.log("JWT after:", token.jti);
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    // DiscordProvider({
    // 	clientId: env.DISCORD_CLIENT_ID,
    // 	clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const { email, password } = credentials;
        try {
          // Sign in the user
          const user = await signIn({ email, password });

          if (!user) {
            throw new Error("Invalid credentials");
          }

          // Check if the user's email is verified in Cognito
          const command = new AdminGetUserCommand({
            UserPoolId: process.env.COGNITO_USER_POOL_ID!,
            Username: email,
          });
          const result = await cognitoClient.send(command);
          const isEmailVerified =
            result.UserAttributes?.find(
              (attr) => attr.Name === "email_verified"
            )?.Value === "true";

          // Attach the verification status to the user object

          return { ...user, isEmailVerified };
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
