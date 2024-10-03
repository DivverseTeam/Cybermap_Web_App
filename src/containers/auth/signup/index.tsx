import React from "react";
import Header from "../components/Header";
import AuthForm from "../components/AuthForm";

export default function SignUpPage() {
  return (
    <div className="w-full flex flex-col">
      <Header />
      <AuthForm
        headerTitle="Sign Up"
        headerSubtitle="Welcome back! Sign in to jump right back in"
      />
    </div>
  );
}
