import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Inter, Public_Sans } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { Wrapper } from "./../_wrapper";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Verakos",
    default: "Verakos",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();

  if (session?.user?.organisationId) {
    redirect("/dashboard");
  }

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className={`${inter.variable}${publicSans.variable} font-sans`}>
        <TRPCReactProvider>
          <Wrapper session={session}>{children}</Wrapper>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
