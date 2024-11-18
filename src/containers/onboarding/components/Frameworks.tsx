import { AutoCompleteComp } from "~/components/AutoComplete";
import { Info } from "~/components/svgs/Info";
import { FRAMEWORKS } from "../constants";
import { BottomNav } from "./BottomNav";

export default function Frameworks({
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
            Select your framework
          </span>
          <span className="font-normal text-[#40566D] text-base leading-8">
            Choose which framework you want to start working on first
          </span>
        </div>
        <div className="bgcolor-[red] flex flex-col gap-8">
          <AutoCompleteComp
            listData={FRAMEWORKS}
            label="Find a framework"
            placeholder="Select your frameworks"
            name="frameworks"
            control={control}
            errors={errors?.frameworks}
          />
        </div>
        <div className="flex w-full flex-col gap-8">
          <div className="flex gap-4 rounded-xl bg-[#F8FAFC] p-6">
            <Info />
            <span className="font-normal text-[#40566D] text-sm leading-6">
              We would like to understand your top priority to help us decide
              how to best guide you. Progress towards one framework contributes
              to other frameworks since they have overlap.
            </span>
          </div>
          <BottomNav
            previousStep={() => changeStep(1)}
            nextStep={() => changeStep(3)}
            isPending={isPending}
          />
        </div>
      </div>
    </div>
  );
}
