import React from "react";
import ControlsPage from "~/containers/controls/ControlsPage";
import { api } from "~/trpc/server";

export default async function page() {
  const [controls, frameworks] = await Promise.all([
    api.controls.getControls(),
    api.frameworks.getFrameworks(),
  ]);

  return <ControlsPage controls={controls} frameworks={frameworks} />;
}
