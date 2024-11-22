"use client";

import { BladeProvider } from "@razorpay/blade/components";
import { bladeTheme } from "@razorpay/blade/tokens";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import type { getServerAuthSession } from "~/server/auth";

interface WrapperProps {
  children: ReactNode;
  session: Awaited<ReturnType<typeof getServerAuthSession>>;
}

export const Wrapper = ({ children, session }: WrapperProps) => {
  return (
    <SessionProvider session={session}>
      <BladeProvider themeTokens={bladeTheme} colorScheme="light">
        {children}
      </BladeProvider>
    </SessionProvider>
  );
};
