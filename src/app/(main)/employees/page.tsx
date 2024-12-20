import type { Metadata } from "next";

import React from "react";
import PersonnelPage from "~/containers/personnel/PersonnelPage";
import { api } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Employees",
};

export default function page() {
  void api.employees.getEmployees.prefetch();

  return <PersonnelPage />;
}
