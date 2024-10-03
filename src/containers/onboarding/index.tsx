import React, { useState } from "react";
import SideBar from "./components/SideBar";
import FormGroup from "./components/FormGroup";

export default function OnboardingPage() {
    const [step, setStep] = useState(1);

    function changeStep(num: number) {
      setStep(num);
    }

  return (
    <div className="w-full flex">
      <SideBar step={step} />
      <FormGroup changeStep={changeStep} step={step} />
    </div>
  );
}
