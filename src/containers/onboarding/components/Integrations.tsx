import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { BottomNav } from "./BottomNav";
import { Controller } from "react-hook-form";
import IntegrationSelect from "./IntegrationSelect";

export default function Integrations({
  changeStep,
  control,
  errors,
  isPending,
}: {
  changeStep: (num: number) => void;
  control: any;
  errors: any;
  isPending: boolean;
}) {
  return (
    <div className="pt-[4.5rem] pb-24 pr-24 w-full">
      <div className="w-full flex flex-col gap-16 px-36">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-[24px] text-[#192839] leading-8">
            Integrations
          </span>
          <span className="font-normal text-base text-[#40566D] leading-8">
            Select your cloud provider for integration
          </span>
        </div>
        <div className="w-full flex flex-col gap-16 max-w-[696px]">
          <Controller
            name="integrations"
            control={control}
            render={({ field }) => (
              <IntegrationSelect
                value={field.value}
                onChange={field.onChange}
                errors={errors.integrations}
              />
            )}
          />
          <BottomNav
            previousStep={() => changeStep(2)}
            nextStep={() => changeStep(4)}
            showSkip={true}
            isPending={isPending}
          />
        </div>
      </div>
    </div>
  );
}
