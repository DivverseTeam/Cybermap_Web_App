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
				<div className="flex flex-col gap-8 bgcolor-[red]">
					<AutoCompleteComp
						listData={FRAMEWORKS}
						label="Find a framework"
						placeholder="Select your frameworks"
						name="frameworks"
						control={control}
						errors={errors?.frameworks}
					/>
				</div>
				<div className="w-full flex flex-col gap-8">
					<div className="bg-[#F8FAFC] flex rounded-xl p-6 gap-4">
						<Info />
						<span className="font-normal text-sm text-[#40566D] leading-6">
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
