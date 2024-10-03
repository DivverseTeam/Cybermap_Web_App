import Image from "next/image";
import { twMerge } from "tailwind-merge";

export default function Integrations({
  changeStep,
}: {
  changeStep: (num: number) => void;
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
          <div className="flex flex-wrap items-center gap-8">
            {[
              "/integrations/vercel.svg",
              "/integrations/supabase.svg",
              "/integrations/gcp.svg",
              "/integrations/heroku.svg",
              "/integrations/aws.svg",
              "/integrations/azure.svg",
              "/integrations/digitalOcean.svg",
              "/integrations/netlify.svg",
            ].map((item, index) => (
              <div
                key={item + String(index)}
                className={twMerge(
                  "flex items-center justify-center h-[150px] w-[150px] rounded-[8px] cursor-pointer p-[10px] border-2 hover:border-2 hover:border-solid hover:border-[#305EFF]",
                  index === 4
                    ? "border-solid border-[#305EFF]"
                    : "border-solid border-[#CBD5E2]"
                )}
              >
                <div className="relative block h-[90px] w-[150px] bg-white">
                  <Image
                    src={item}
                    alt="image"
                    fill={true}
                    objectFit="contain"
                    objectPosition="center"
                    priority={true}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="w-full flex justify-end items-center gap-4 ">
            <button
              onClick={() => changeStep(2)}
              className="max-w-fit h-[36px] px-[20px] outline-none text-gray-1 bg-gray-1 rounded-sm font-semibold text-sm"
            >
              Back
            </button>
            <button
              onClick={() => changeStep(4)}
              className="max-w-fit h-[36px] px-[20px] outline-none text-white bg-[#305EFF] rounded-sm font-semibold text-sm"
            >
              Finish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
