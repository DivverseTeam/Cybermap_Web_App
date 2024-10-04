import { twMerge } from "tailwind-merge";
import { CyberMapLogo } from "~/components/svgs/CyberMapLogo";

export default function SideBar() {
  return (
    <div className="w-[28.563rem] pt-12 pr-8 pb-20 pl-12 bg-[#192839] flex flex-col justify-between">
      <div className="flex flex-col gap-20">
        <div className="flex items-center gap-2">
          <CyberMapLogo />
          <span className="font-semibold text-sm text-white">CyberMap</span>
        </div>
        <div className="flex flex-col gap-1">
          {[
            {
              title: "Company info",
              subtitle: "Fill details about your company",
              active: true,
            },
            {
              title: "Frameworks",
              subtitle: "Select the framework you want to start",
              active: false,
            },
            {
              title: "Integrations",
              subtitle: "Select your cloud provider",
              active: false,
            },
            {
              title: "Finish",
              subtitle: "Finalize setup and start running",
              active: false,
            },
          ].map(({ title, subtitle, active }, index, arr) => (
            <div className="flex gap-[1.188rem]" key={index}>
              <div className="flex flex-col items-center gap-[4px]">
                <div
                  className={twMerge(
                    "w-8 h-8 rounded-[50%] border-2 border-solid flex items-center justify-center",
                    active ? "border-white" : "border-[#6C849D2E]"
                  )}
                >
                  <span
                    className={twMerge(
                      "text-sm",
                      active ? "text-white" : "text-[#6C849D2E]"
                    )}
                  >
                    {index + 1}
                  </span>
                </div>
                {Boolean(index + 1 !== arr.length) && (
                  <div className="border-l-2 border-solid border-[#6C849D2E] h-10"></div>
                )}
              </div>
              <div className="flex flex-col">
                <span
                  className={
                    active
                      ? "font-semibold text-base text-white leading-8"
                      : "font-semibold text-base text-[#40566D] leading-8"
                  }
                >
                  {title}
                </span>
                <span
                  className={
                    active
                      ? "font-normal text-base text-white leading-8 opacity-40"
                      : "font-normal text-base text-[#6C849D52] leading-8 "
                  }
                >
                  {subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-6">
          <CyberMapLogo />
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-base text-white opacity-85">
              Having trouble?
            </span>
            <span className="font-normal text-sm text-white opacity-85">
              Feel free to contact us and we will always help you through the
              process
            </span>
          </div>
          <button className="w-[5.5rem] h-8 outline-none border border-solid border-white text-white rounded-sm font-semibold text-xs">
            Contact us
          </button>
        </div>
      </div>
    </div>
  );
}
