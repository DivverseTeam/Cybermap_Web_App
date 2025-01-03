import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Inter, Public_Sans } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { Wrapper } from "./_wrapper";
import { getServerAuthSession } from "~/server/auth";
import { Toaster } from "./_components/ui/toaster";
import { HydrateClient } from "~/trpc/server";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();

  return (
    <TRPCReactProvider>
      <HydrateClient>
        <html lang="en" className={`${GeistSans.variable}`}>
          <body className={`${inter.variable}${publicSans.variable} font-sans`}>
            <NextTopLoader showSpinner={false} />
            <Wrapper session={session}>{children}</Wrapper>
            <Toaster />
          </body>
        </html>
      </HydrateClient>
    </TRPCReactProvider>
  );
}
