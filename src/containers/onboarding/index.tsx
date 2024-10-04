import React from "react";
import SideBar from "./components/SideBar";
import FormGroup from "./components/FormGroup";

export default function OnboardingPage() {
  return (
    <div className="w-full flex">
      <SideBar />
      <FormGroup />
    </div>
  );
}
