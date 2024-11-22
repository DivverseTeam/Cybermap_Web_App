import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Inter, Public_Sans } from "next/font/google";
import SideNavbar from "~/components/layout/SideNavbar";
import BreadCrumbs from "~/components/layout/breadcrumbs";
import Header from "~/components/layout/header";
import { TRPCReactProvider } from "~/trpc/react";
import { Wrapper } from "../_wrapper";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { AppRoutes } from "~/routes";

export const metadata: Metadata = {
  title: "CYBERMAP",
  description: "Cybermap",
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

  if (!session) {
    redirect(AppRoutes.AUTH.LOGIN);
  }

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className={`${inter.variable}${publicSans.variable} font-sans`}>
        <TRPCReactProvider>
          <Wrapper session={session}>
            <div className="flex">
              <SideNavbar />
              <div className="ml-[250px] h-full w-full [@media(min-width:1400px)]:ml-[280px] ">
                <Header />
                <div className="container mx-auto mt-16 flex flex-col gap-6 px-4 py-5 2xl:px-8 2xl:py-16 [@media(min-width:1300px)]:mt-[72px] [@media(min-width:1400px)]:px-6 [@media(min-width:1400px)]:py-10">
                  <BreadCrumbs />
                  {children}
                </div>
              </div>
            </div>
          </Wrapper>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
