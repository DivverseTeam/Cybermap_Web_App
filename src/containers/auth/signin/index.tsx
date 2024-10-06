"use client";
import React from "react";
import Header from "../components/Header";
import AuthForm from "../components/AuthForm";

type Props = {
	callbackUrl?: string;
	error?: string;
};

export default function SignInPage({ callbackUrl, error }: Props) {
	return (
		<div className="w-full flex flex-col">
			<Header />
			<AuthForm
				headerTitle="Sign In"
				headerSubtitle="Welcome back! Sign in to jump right back in"
				callbackUrl={callbackUrl}
				error={error}
			/>
		</div>
	);
}
