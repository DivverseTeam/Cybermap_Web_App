import React from "react";
import Header from "../components/Header";
// import AuthForm from "../components/AuthForm";
import SignInForm from "../components/signin-form";

export default function SignInPage() {
  return (
    <div className="w-full flex flex-col">
      <Header />
      <SignInForm
        headerTitle="Sign In"
        headerSubtitle="Welcome back! Sign in to jump right back in"
      />
    </div>
  );
}
