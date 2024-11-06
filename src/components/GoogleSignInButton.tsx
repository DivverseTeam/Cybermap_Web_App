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
			className="border w-full flex bg-[#FFFFFF] hover:bg-[#f3f3f3] text-black gap-4 h-12"
		>
			<span className="font-semibold">Sign in with Google</span>
			<GoogleLogo />
		</Button>
	);
}
