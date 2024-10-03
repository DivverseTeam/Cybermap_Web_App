import { useState } from "react";
import CompanyInfo from "./CompanyInfo";
import Frameworks from "./Frameworks";
import Integrations from "./Integrations";

export default function FormGroup({
  changeStep,
  step,
}: {
  changeStep: (num: number) => void;
  step: number;
}) {
  return (
    <div className="w-full">
      {(() => {
        switch (step) {
          case 1:
            return <CompanyInfo changeStep={changeStep} />;
          case 2:
            return <Frameworks changeStep={changeStep} />;
          case 3:
            return <Integrations changeStep={changeStep} />;
          default:
            return <CompanyInfo changeStep={changeStep} />;
        }
      })()}
    </div>
  );
}
