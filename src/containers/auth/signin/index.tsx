import React from "react";
import Header from "../components/Header";
import SignInForm from "../components/signin-form";

type Props = {
  callbackUrl?: string;
  error?: string;
};

export default function SignInPage({ callbackUrl, error }: Props) {
  return (
    <div className="flex w-full flex-col">
      <Header />
      <SignInForm
        headerTitle="Sign In"
        headerSubtitle="Welcome back! Sign in to jump right back in"
        callbackUrl={callbackUrl}
        error={error}
      />
    </div>
  );
}
