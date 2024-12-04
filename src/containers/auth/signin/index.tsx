"use client";
import React from "react";
import Header from "../components/Header";
import SignInForm from "../components/signin-form";

type Props = {
  searchParams?: Promise<Record<"callbackUrl" | "error", string>>;
};

export default async function SignInPage({ searchParams }: Props) {
  const search = await searchParams;

  return (
    <div className="flex w-full flex-col">
      <Header />
      <SignInForm
        headerTitle="Sign In"
        headerSubtitle="Welcome back! Sign in to jump right back in"
        callbackUrl={search?.callbackUrl}
        error={search?.error}
      />
    </div>
  );
}
