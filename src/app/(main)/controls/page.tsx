import React from "react";
import ControlsPage from "~/containers/controls/ControlsPage";
import { api } from "~/trpc/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Controls",
};

export default async function page() {
  const [controls, frameworks] = await Promise.all([
    api.controls.getControls(),
    api.frameworks.getFrameworks(),
  ]);

  return <ControlsPage controls={controls} frameworks={frameworks} />;
}
