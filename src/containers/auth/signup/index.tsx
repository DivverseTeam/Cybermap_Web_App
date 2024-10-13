import React from "react";
import Header from "../components/Header";
import SignUpForm from "../components/signup-form";

export default function SignUpPage() {
	return (
		<div className="w-full flex flex-col">
			<Header />
			<SignUpForm
				headerTitle="Sign Up"
				headerSubtitle="Create an account with us to get started"
			/>
		</div>
	);
}
