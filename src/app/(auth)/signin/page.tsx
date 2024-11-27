import type { Metadata } from "next";
import React from "react";
import SignInPage from "~/containers/auth/signin";

type Props = {
  searchParams?: Promise<Record<"callbackUrl" | "error", string>>;
};

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function page(props: Props) {
  const searchParams = await props.searchParams;
  return (
    <SignInPage
      error={searchParams?.error}
      callbackUrl={searchParams?.callbackUrl}
    />
  );
}
