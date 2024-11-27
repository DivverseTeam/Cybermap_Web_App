import type { Metadata } from "next";
import React from "react";
import PersonnelPage from "~/containers/personnel/PersonnelPage";

export const metadata: Metadata = {
  title: "Employees",
};

export default function page() {
  return <PersonnelPage />;
}
