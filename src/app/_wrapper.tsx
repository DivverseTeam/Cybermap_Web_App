"use client";

import type { ReactNode } from "react";
import { BladeProvider } from "@razorpay/blade/components";
import { bladeTheme } from "@razorpay/blade/tokens";
import { SessionProvider } from "next-auth/react";

interface WrapperProps {
	children: ReactNode;
}

export const Wrapper = ({ children }: WrapperProps) => {
	return (
		<SessionProvider>
			<BladeProvider themeTokens={bladeTheme} colorScheme="light">
				{children}
			</BladeProvider>
		</SessionProvider>
	);
};
