import useOnboarding from "../hook/useOnboarding";
import CompanyInfo from "./CompanyInfo";
import Frameworks from "./Frameworks";
import Integrations from "./Integrations";
import SideBar from "./SideBar";

export default function FormGroup() {
  const { control, errors, changeStep, step, isPending, setValue } = useOnboarding();
  return (
    <div className="w-full flex">
      <SideBar step={step} />
      <form className="w-full">
        {(() => {
          switch (step) {
            case 1:
              return (
                <CompanyInfo
                  changeStep={changeStep}
                  control={control}
                  errors={errors}
                  isPending={isPending}
                  onImgChange={(img) => setValue("logoUrl", img)}
                />
              );
            case 2:
              return (
                <Frameworks
                  changeStep={changeStep}
                  control={control}
                  errors={errors}
                  isPending={isPending}
                />
              );
            case 3:
              return (
                <Integrations
                  changeStep={changeStep}
                  control={control}
                  errors={errors}
                  isPending={isPending}
                />
              );
            default:
              return <></>;
          }
        })()}
      </form>
    </div>
  );
}
