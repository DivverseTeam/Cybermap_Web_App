import Image from "next/image";
import React, { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import { Controller } from "react-hook-form";
import { AppInput } from "~/components/BladeTextInput";
import { DropSelect } from "~/components/DropSelect";
import { UserAvatar } from "~/components/svgs/userAvatar";
import { ORGANISATION_INDUSTRIES, ORGANISATION_SIZES } from "~/lib/types";
import { BottomNav } from "./BottomNav";
import { OrganisationKind } from "./OrganisationKind";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";

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
  const { data: session, status } = useSession();
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);

  const { mutate: presignedUrlMutation } =
    api.general.getS3PresignedUrl.useMutation();

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }
    presignedUrlMutation(
      {
        type: "ORGANISATION_LOGO",
        fileType: "image/jpg",
        id: session.user.organisationId,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          setUploadUrl(data.url);
        },
        onError: (error) => {
          console.error("Error getting presigned URL:", error);
        },
      },
    );
  }, [status]);

  return (
    <div className="w-full pt-[4.5rem] pr-24 pb-24">
      <div className="flex w-full flex-col gap-16 px-36">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-[#192839] text-[24px] leading-8">
            Tell us about your organisation
          </span>
          <span className="font-normal text-[#40566D] text-base leading-8">
            This would help us tailor your experience on our platform
          </span>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-[50%] border-[#B1C1D2] border-[1.64px] border-dashed">
              {!preview ? (
                <UserAvatar />
              ) : (
                <div className="relative block h-16 w-16 rounded-[50%]">
                  <Image
                    src={preview}
                    alt={"logo"}
                    fill={true}
                    priority={true}
                    className="h-16 w-16 rounded-[50%]"
                    style={{
                      maxWidth: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Dropzone
                onDrop={(acceptedFiles) => {
                  if (acceptedFiles) {
                    const file = acceptedFiles[0] as File;
                    // TODO: Upload the file to uploadUrl and set the logoUrl property
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
                    className="relative flex h-[1.75rem] max-w-fit cursor-pointer items-center justify-center rounded-sm border border-[#CBD5E2] border-solid px-2 font-semibold text-[#40566D] text-[10px] outline-none"
                  >
                    Upload a logo
                    <input {...getInputProps()} />
                  </div>
                )}
              </Dropzone>
              <span className="font-normal text-[#768EA7] text-[11px] italic leading-4">
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
              <OrganisationKind
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
            list={ORGANISATION_INDUSTRIES.map((item) => item)}
          />
          <DropSelect
            label="How large is your organisation?"
            placeholder={ORGANISATION_SIZES[0] || ""}
            name="size"
            control={control}
            list={ORGANISATION_SIZES.map((item) => item)}
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
