// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      organisationId?: string;
      isEmailVerified?: boolean;
    } & DefaultSession["user"];
    token?: string; // Add token
  }

  interface JWT {
    id: string;
    role: string;
    organisationId?: string;
    isEmailVerified?: boolean;
    token?: string; // Add token to JWT
  }
}
