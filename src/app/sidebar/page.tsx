import React from "react";
import { SidebarNav } from "../../components/layout/sidebar";
import {
	Analytics01Icon,
	CurvyRightDirectionIcon,
	FrameworksIcon,
	FileValidationIcon,
	LibraryIcon,
	PolicyIcon,
	UserMultipleIcon,
	OnlineLearning01Icon,
	Audit02Icon,
	AccountSetting02Icon,
	Logout02Icon,
} from "hugeicons-react";
import Header from "~/components/layout/header";

export default function page() {
	return (
		<>
			<SidebarNav
				items={[
					{ title: "Dashboard", icon: <Analytics01Icon />, href: "/dashboard" },
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
							{ title: "Polices", icon: <PolicyIcon />, href: "/policies" },
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
		</>
	);
}
