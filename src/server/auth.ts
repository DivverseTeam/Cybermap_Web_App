import {
  type DefaultSession,
  type NextAuthOptions,
  getServerSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { signIn } from "./api/routers/actions";
import { User } from "./models/User";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => {
      const { id, role, organisationId } = token;
      return {
        ...session,
        user: {
          ...session.user,
          id,
          role,
          organisationId,
        },
      };
    },
    jwt: ({ token, user, account }) => {
      if (account && user) {
        token.id = user.id;
        token.sub = user.id;

        const parsedUser = User.safeParse(user);

        if (parsedUser.success) {
          const { id, role, organisationId } = parsedUser.data;
          token.id = id;
          token.role = role;
          token.organisationId = organisationId;
        }
      }
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
          const user = await signIn({ email, password });

          return user;
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
