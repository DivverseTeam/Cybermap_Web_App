import { Button, TextInput } from "@razorpay/blade/components";
import { twMerge } from "tailwind-merge";
import { DropSelect } from "~/components/DropSelect";
import { UserAvatar } from "~/components/svgs/userAvatar";

export default function OrganizationDetails() {
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
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-base text-[#40566D]">
              Your organisation name
            </span>
            <TextInput
              placeholder="Enter the name of your organisation"
              accessibilityLabel="Enter your name"
              defaultValue="John Ives"
              labelPosition="top"
              name="name"
              //   onBlur={function noRefCheck() {}}
              //   onChange={function noRefCheck() {}}
              //   onClick={function noRefCheck() {}}
              //   onFocus={function noRefCheck() {}}
              //   onSubmit={function noRefCheck() {}}
              prefix=""
              suffix=""
              //   textAlign="left"
              type="url"
              validationState="none"
            />
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-base text-[#40566D]">
              What kind of organisation are you?
            </span>
            <div className="flex flex-wrap gap-3 w-[500px]">
              {[
                "Bootstrapped Tech Startup",
                "Software & Design Agency",
                "Freelancer & Solopreneur",
                "eCommerce business",
                "eCommerce business",
                "Small Consulting & Advisory Firm",
                "VC Firm",
                "University",
                "Other",
              ].map((item, index) => (
                <div
                  key={index}
                  className={twMerge(
                    "rounded h-8 px-2 bg-[#305EFF17] font-[500] text-xs flex items-center justify-center",
                    index === 0
                      ? "bg-[#305EFF17] text-[#305EFF]"
                      : "bg-[#F8FAFC] text-[#243547]"
                  )}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-base text-[#40566D]">
              Select your Industry
            </span>
            <DropSelect
              label=""
              placeholder="Information and Technology"
              name="industry"
              onChange={() => {}}
              list={[
                "Information and Technology",
                "Design",
                "E-commerce",
                "Consulting",
              ]}
            />
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-base text-[#40566D]">
              How large is your organisation?
            </span>
            <DropSelect
              label=""
              placeholder="250+"
              name="industry"
              onChange={() => {}}
              list={["1-10", "11-50", "51-250", "250+"]}
            />
          </div>
        </div>
        <div className="w-full flex justify-end items-center gap-4">
          <button className="max-w-fit h-[36px] px-[20px] outline-none text-gray-1 bg-gray-1 rounded-sm font-semibold text-sm">
            Back
          </button>
          <button className="max-w-fit h-[36px] px-[20px] outline-none text-white bg-[#305EFF] rounded-sm font-semibold text-sm">
            Next step
          </button>
        </div>
      </div>
    </div>
  );
}
