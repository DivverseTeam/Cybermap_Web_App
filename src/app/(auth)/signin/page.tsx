import React from "react";
import SignInPage from "~/containers/auth/signin";

type Props = {
	searchParams?: Record<"callbackUrl" | "error", string>;
};

export default function page(props: Props) {
	return (
		<SignInPage
			error={props?.searchParams?.error}
			callbackUrl={props?.searchParams?.callbackUrl}
		/>
	);
}
