import React from "react";
import { Button } from "~/app/_components/ui/button";
import GoogleLogo from "./svgs/googleLogo";

type Props = {};

export default function GoogleSignInButton({}: Props) {
	const loginWithGoogle = () => {
		console.log("login with google");
	};
	return (
		<Button
			onClick={loginWithGoogle}
			className="flex h-12 w-full gap-4 border bg-[#FFFFFF] text-black hover:bg-[#f3f3f3]"
		>
			<span className="font-semibold">Sign in with Google</span>
			<GoogleLogo />
		</Button>
	);
}
