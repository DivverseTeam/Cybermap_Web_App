import type { Metadata } from "next";
import React from "react";
import SignInPage from "~/containers/auth/signin";

type Props = {
  searchParams?: Promise<Record<"callbackUrl" | "error", string>>;
};

export const metadata: Metadata = {
  title: "Sign In",
};

export default function page(props: Props) {
  return <SignInPage searchParams={props.searchParams} />;
}
