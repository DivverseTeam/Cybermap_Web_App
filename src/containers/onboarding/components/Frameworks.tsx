import { Info } from "~/components/svgs/Info";

export default function Frameworks({
  changeStep,
}: {
  changeStep: (num: number) => void;
}) {
  return (
    <div className="pt-[4.5rem] pb-24 pr-24 w-full">
      <div className="w-full flex flex-col gap-16 px-36">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-[24px] text-[#192839] leading-8">
            Select your framework
          </span>
          <span className="font-normal text-base text-[#40566D] leading-8">
            Choose which framework you want to start working on first
          </span>
        </div>

        <div className="w-full flex flex-col gap-8">
          <div className="bg-[#F8FAFC] flex items-center rounded-xl p-6">
            <Info />
            <span className="font-normal text-sm text-[#40566D] leading-6">
              We would like to understand your top priority to help us decide
              how to best guide you. Progress towards one framework contributes
              to other frameworks since they have overlap.
            </span>
          </div>

          <div className="w-full flex justify-end items-center gap-4">
            <button
              onClick={() => changeStep(1)}
              className="max-w-fit h-[36px] px-[20px] outline-none text-gray-1 bg-gray-1 rounded-sm font-semibold text-sm"
            >
              Back
            </button>
            <button
              onClick={() => changeStep(3)}
              className="max-w-fit h-[36px] px-[20px] outline-none text-white bg-[#305EFF] rounded-sm font-semibold text-sm"
            >
              Next step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
