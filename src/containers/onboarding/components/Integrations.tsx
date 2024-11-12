import Image from "next/image";
import { Controller } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { BottomNav } from "./BottomNav";
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
    <div className="w-full pt-[4.5rem] pr-24 pb-24">
      <div className="flex w-full flex-col gap-16 px-36">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-[#192839] text-[24px] leading-8">
            Integrations
          </span>
          <span className="font-normal text-[#40566D] text-base leading-8">
            Select your cloud provider for integration
          </span>
        </div>
        <div className="flex w-full max-w-[696px] flex-col gap-16">
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
