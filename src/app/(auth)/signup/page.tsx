import type { Metadata } from "next";
import React from "react";
import SignUpPage from "~/containers/auth/signup";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function page() {
  return <SignUpPage />;
}
