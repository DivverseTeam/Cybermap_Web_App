import "~/styles/globals.css";

import type { Metadata } from "next";
import SideNavbar from "~/components/layout/SideNavbar";
import BreadCrumbs from "~/components/layout/breadcrumbs";
import Header from "~/components/layout/header";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { AppRoutes } from "~/routes";

export const metadata: Metadata = {
  title: {
    template: "%s | Verakos",
    default: "Verakos",
  },
  description: "Verakos",
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
    <div className="flex">
      <SideNavbar />
      <div className="flex flex-col gap-6 my-4 bg-white border rounded-3xl ml-[254px] h-full min-h-screen w-full [@media(min-width:1400px)]:ml-[280px] ">
        <Header />
        <div className="container h-full w-full mx-auto  px-4 py-1 2xl:px-8 2xl:py-16 [@media(min-width:1400px)]:px-6 [@media(min-width:1400px)]:py-2">
          {/* <BreadCrumbs /> */}
          {children}
        </div>
      </div>
    </div>
  );
}
