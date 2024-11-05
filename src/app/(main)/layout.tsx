import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Inter, Public_Sans } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { Wrapper } from "../_wrapper";
import Header from "~/components/layout/header";
import {
  Analytics01Icon,
  Audit02Icon,
  CurvyRightDirectionIcon,
  FileValidationIcon,
  FrameworksIcon,
  LibraryIcon,
  OnlineLearning01Icon,
  PolicyIcon,
  UserMultipleIcon,
} from "hugeicons-react";
import { SidebarNav } from "~/components/layout/sidebar";
import BreadCrumbs from "~/components/layout/breadcrumbs";
import SideNavbar from "~/components/layout/SideNavbar";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className={`${inter.variable} ${publicSans.variable} font-sans`}>
        <TRPCReactProvider>
          <Wrapper>
            {/* <SidebarNav
              items={[
                {
                  title: "Dashboard",
                  icon: <Analytics01Icon />,
                  href: "/dashboard",
                },
                {
                  title: "Starter guide",
                  icon: <CurvyRightDirectionIcon />,
                  href: "/starter-guide",
                },
                {
                  title: "COMPLIANCE",
                  submenu: [
                    {
                      title: "Frameworks",
                      icon: <FrameworksIcon />,
                      href: "/frameworks",
                    },
                    {
                      title: "Controls",
                      icon: <FileValidationIcon />,
                      href: "/controls",
                    },
                    {
                      title: "Evidence Library",
                      icon: <LibraryIcon />,
                      href: "/evidence-library",
                    },
                    {
                      title: "Polices",
                      icon: <PolicyIcon />,
                      href: "/policies",
                    },
                  ],
                },
                {
                  title: "MANAGEMENT",
                  submenu: [
                    {
                      title: "Personnel",
                      icon: <UserMultipleIcon />,
                      href: "/personnel",
                    },
                    {
                      title: "Integrations",
                      icon: <CurvyRightDirectionIcon />,
                      href: "/integrations",
                    },
                    {
                      title: "Training modules",
                      icon: <OnlineLearning01Icon />,
                      href: "/training-modules",
                    },
                    {
                      title: "Audit center",
                      icon: <Audit02Icon />,
                      href: "/audit-center",
                    },
                  ],
                },
              ]}
            /> */}
            <div className="flex">
              <SideNavbar />
              <div className="ml-[280px] w-full h-[calc(100vh-72px)] ">
                <Header />
                <div className="container mx-auto flex flex-col gap-6 px-6 2xl:px-8 py-10 2xl:py-16">
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
