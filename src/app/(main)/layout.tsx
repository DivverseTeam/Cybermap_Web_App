import "~/styles/globals.css";

import type { Metadata } from "next";
import SideNavbar from "~/components/layout/SideNavbar";
import BreadCrumbs from "~/components/layout/breadcrumbs";
import Header from "~/components/layout/header";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { AppRoutes } from "~/routes";
import { HydrateClient } from "~/trpc/server";

export const metadata: Metadata = {
  title: {
    template: "%s | CYBERMAP",
    default: "CYBERMAP",
  },
  description: "Cybermap",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect(AppRoutes.AUTH.LOGIN);
  }

  if (!session.user.organisationId) {
    redirect(AppRoutes.AUTH.ONBOARDING);
  }

  return (
    <HydrateClient>
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
    </HydrateClient>
  );
}
