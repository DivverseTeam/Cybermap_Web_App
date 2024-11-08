import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
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
import type { Metadata } from "next";
import { Inter, Public_Sans } from "next/font/google";
import SideNavbar from "~/components/layout/SideNavbar";
import BreadCrumbs from "~/components/layout/breadcrumbs";
import Header from "~/components/layout/header";
import { SidebarNav } from "~/components/layout/sidebar";
import { TRPCReactProvider } from "~/trpc/react";
import { Wrapper } from "../_wrapper";

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
			<body className={`${inter.variable}${publicSans.variable} font-sans`}>
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
							<div className="ml-[280px] h-full w-full ">
								<Header />
								<div className="container mx-auto mt-14 flex flex-col gap-6 px-6 py-10 2xl:px-8 2xl:py-16 [@media(min-width:1300px)]:mt-[72px]">
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
