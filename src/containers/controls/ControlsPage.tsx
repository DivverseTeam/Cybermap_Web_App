"use client";

import React from "react";
import PageTitle from "~/components/PageTitle";
import { NewControlSheet } from "./components/new-controls-sheet";

type Props = {};

export default function ControlsPage({}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title="Controls"
        subtitle="View and manage your controls"
        action={<NewControlSheet />}
      />
    </div>
  );
}
