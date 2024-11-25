import React from "react";
import ControlsPage from "~/containers/controls/ControlsPage";
import { api } from "~/trpc/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Controls",
};

export default function page() {
  void api.frameworks.get.prefetch();
  void api.controls.get.prefetch();

  return <ControlsPage />;
}
