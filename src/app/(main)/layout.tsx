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
						<SidebarNav
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
											title: "Integration",
											icon: <CurvyRightDirectionIcon />,
											href: "/integration",
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
						/>
						<Header />
						{/* #E7E8EC */}
						<div className="ml-64 h-[calc(100vh-58px)] bg-[#E7E8EC] p-6">
							<div className="container mx-auto">
								<BreadCrumbs />
								{children}
							</div>
						</div>
					</Wrapper>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
