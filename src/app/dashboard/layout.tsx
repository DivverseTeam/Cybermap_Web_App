"use client";

import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Inter, Public_Sans } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { Wrapper } from "../_wrapper";
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
import { cn } from "~/lib/utils";
import SideNavbar from "~/containers/dashboard/components/SideNavbar";
import DashboardHeader from "~/containers/dashboard/components/DashboardHeader";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// export const metadata: Metadata = {
//   title: "CYBERMAP",
//   description: "Cybermap",
//   icons: [{ rel: "icon", url: "/favicon.ico" }],
// };

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname(); // Get the current pathname
  const [loading, setLoading] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname); // Keep track of the previous path

  useEffect(() => {
    // If the path changes, show the loading state
    if (pathname !== prevPath) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false); // Simulate a short delay for loading state
      }, 500); // You can adjust the delay time as needed
      setPrevPath(pathname); // Update the previous path
    }
  }, [pathname, prevPath]);

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <TRPCReactProvider>
        <Wrapper>
          <body
            className={cn(
              "min-h-screen  w-full bg-white text-black flex m-0",
              inter.className,
              {
                "debug-screens": process.env.NODE_ENV === "development",
              }
            )}
          >
            {/* Sidebar */}
            <div className="flex">
              <div className="fixed z-10 bg-white">
                <SideNavbar />
              </div>
              <main className="w-full min-h-[100vh] bg-[#F9F9FB] scroll ml-[280px] ">
                <DashboardHeader />

                <div className="px-6 h-full bg-[#F9F9FB] main-content ">
                  {loading && (
                    <div className="loading-overlay">
                      <div className="w-40 h-40 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
                    </div>
                  )}
                  {children}
                </div>
              </main>
              <style jsx>{`
                .main-content {
                  position: relative;
                  height: 100%;
                }
                .loading-overlay {
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  display: flex;
                  justify-content: center;
                  background: rgba(255, 255, 255, 0.8);
                  font-size: 24px;
                  color: #000;
                  z-index: 10;
                  padding-top: 100px;
                }
              `}</style>
            </div>
          </body>
        </Wrapper>
      </TRPCReactProvider>
    </html>
  );
}
