import Image from "next/image";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { Controller } from "react-hook-form";
import { AppInput } from "~/components/BladeTextInput";
import { DropSelect } from "~/components/DropSelect";
import { UserAvatar } from "~/components/svgs/userAvatar";
import { ORGANIZATION_INDUSTRIES, ORGANIZATION_SIZES } from "~/lib/types";
import { BottomNav } from "./BottomNav";
import { OrganizationKind } from "./OrganizationKind";

function CompanyInfo({
  changeStep,
  control,
  errors,
  isPending,
  onImgChange,
}: {
  changeStep: (num: number) => void;
  control: any;
  errors: any;
  isPending: boolean;
  onImgChange: (img: string) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

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
              {!preview ? (
                <UserAvatar />
              ) : (
                <div className="w-16 h-16 rounded-[50%] block relative">
                  <Image
                    src={preview}
                    alt={"logo"}
                    fill={true}
                    objectFit="cover"
                    objectPosition="center"
                    priority={true}
                    className="rounded-[50%] w-16 h-16"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Dropzone
                onDrop={(acceptedFiles) => {
                  if (acceptedFiles) {
                    const file = acceptedFiles[0] as File;
                    console.log("acceptedFiles", file);
                    onImgChange(file?.name as string);
                    const reader = new FileReader();
                    reader.onload = () => {
                      const result = reader.result as string;
                      setPreview(result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                maxFiles={1}
                noDrag={true}
              >
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    className="relative flex justify-center items-center max-w-fit h-[1.75rem] px-2 cursor-pointer outline-none border border-solid border-[#CBD5E2] text-[#40566D] rounded-sm font-semibold text-[10px]"
                  >
                    Upload a logo
                    <input {...getInputProps()} />
                  </div>
                )}
              </Dropzone>
              <span className="font-normal text-[11px] text-[#768EA7] leading-4 italic">
                You can upload JPG or PNG. Max size 5MB.
              </span>
            </div>
          </div>
          <AppInput
            placeholder="Enter the name of your organisation"
            label="Your organisation name"
            name="name"
            control={control}
            errors={errors.name}
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
          isPending={isPending}
        />
      </div>
    </div>
  );
}

export default React.memo(CompanyInfo);
