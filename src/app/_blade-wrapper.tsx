"use client";

import type { ReactNode } from "react";
import { BladeProvider } from "@razorpay/blade/components";
import { bladeTheme } from "@razorpay/blade/tokens";

interface BladeWrapperProps {
	children: ReactNode;
}

export const BladeWrapper = ({ children }: BladeWrapperProps) => {
	return (
		<BladeProvider themeTokens={bladeTheme} colorScheme="light">
			{children}
		</BladeProvider>
	);
};
