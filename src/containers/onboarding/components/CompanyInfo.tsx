import React from "react";
import { Controller } from "react-hook-form";
import { AppInput } from "~/components/BladeTextInput";
import { DropSelect } from "~/components/DropSelect";
import { UserAvatar } from "~/components/svgs/userAvatar";
import { BottomNav } from "./BottomNav";
import { OrganizationKind } from "./OrganizationKind";
import { ORGANIZATION_INDUSTRIES, ORGANIZATION_SIZES } from "~/lib/types";

function CompanyInfo({
  changeStep,
  control,
  errors,
}: {
  changeStep: (num: number) => void;
  control: any;
  errors: any;
}) {
  return (
    <div className="pt-[4.5rem] pb-24 pr-24 w-full">
      <div className="w-full flex flex-col gap-16 px-36">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-[24px] text-[#192839] leading-8">
            Tell us about your organisation
          </span>
          <span className="font-normal text-base text-[#40566D] leading-8">
            This would help us tailor your experience on our platform
          </span>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex gap-3">
            <div className="w-16 h-16 rounded-[50%] border-[1.64px] border-dashed border-[#B1C1D2] flex items-center justify-center">
              <UserAvatar />
            </div>
            <div className="flex flex-col gap-2">
              <button className="max-w-fit h-[1.75rem] px-2 outline-none border border-solid border-[#CBD5E2] text-[#40566D] rounded-sm font-semibold text-[10px]">
                Upload a logo
              </button>
              <span className="font-normal text-[11px] text-[#768EA7] leading-4 italic">
                You can upload JPG or PNG. Max size 5MB.
              </span>
            </div>
          </div>
          <AppInput
            placeholder="Enter the name of your organisation"
            label="Your organisation name"
            name="orgName"
            control={control}
            errors={errors.orgName}
          />
          <Controller
            name="kind"
            control={control}
            render={({ field }) => (
              <OrganizationKind
                value={field.value}
                onChange={field.onChange}
                errors={errors.kind}
              />
            )}
          />
          <DropSelect
            label="Select your Industry"
            placeholder="Information and Technology"
            name="industry"
            control={control}
            errors={errors.industry}
            list={ORGANIZATION_INDUSTRIES.map((item) => item)}
          />
          <DropSelect
            label="How large is your organisation?"
            placeholder={ORGANIZATION_SIZES[0] || ""}
            name="size"
            control={control}
            list={ORGANIZATION_SIZES.map((item) => item)}
            errors={errors.size}
          />
        </div>
        <BottomNav
          previousStep={() => changeStep(2)}
          nextStep={() => changeStep(2)}
          hasPrevious={false}
        />
      </div>
    </div>
  );
}

export default React.memo(CompanyInfo);
