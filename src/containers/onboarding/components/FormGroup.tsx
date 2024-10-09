import useOnboarding from "../hook/useOnboarding";
import CompanyInfo from "./CompanyInfo";
import Frameworks from "./Frameworks";
import Integrations from "./Integrations";

export default function FormGroup() {
  const {
    handleSubmit,
    onSubmit,
    control,
    errors,
    changeStep,
    step,
  } = useOnboarding();
  return (
    <form className="w-full">
      {(() => {
        switch (step) {
          case 1:
            return (
              <CompanyInfo
                changeStep={changeStep}
                control={control}
                errors={errors}
              />
            );
          case 2:
            return (
              <Frameworks
                changeStep={changeStep}
                control={control}
                errors={errors}
              />
            );
          case 3:
            return (
              <Integrations
                changeStep={changeStep}
                control={control}
                errors={errors}
              />
            );
          default:
            return <></>;
        }
      })()}
    </form>
  );
}
