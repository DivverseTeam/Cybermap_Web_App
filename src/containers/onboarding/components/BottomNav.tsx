import { twMerge } from "tailwind-merge";
import { Button } from "~/app/_components/ui/button";

export function BottomNav({
	nextStep,
	previousStep,
	showSkip,
	isPending,
	hasPrevious = true,
}: {
	previousStep: () => void;
	nextStep: () => void;
	isPending: boolean;
	showSkip?: boolean;
	hasPrevious?: boolean;
}) {
	return (
		<div
			className={twMerge(
				"flex w-full items-center gap-4",
				showSkip ? "justify-between" : "justify-end",
			)}
		>
			{showSkip && (
				<span className="cursor-pointer font-semibold text-[#305EFF] text-base leading-8">
					Skip this step
				</span>
			)}
			<div className="flex items-center gap-4 ">
				<button
					onClick={(e) => {
						e.preventDefault();
						previousStep();
					}}
					disabled={!hasPrevious}
					className={twMerge(
						"h-[36px] max-w-fit rounded-sm border border-[#CBD5E2] border-solid px-[20px] font-semibold text-[#243547] text-sm outline-none",
						hasPrevious
							? "cursor-pointer"
							: "cursor-not-allowed bg-gray-1 text-gray-1",
					)}
				>
					Back
				</button>
				<Button
					size="sm"
					type="submit"
					loading={isPending}
					onClick={(e) => {
						e.preventDefault();
						nextStep();
					}}
				>
					{isPending ? "Loading" : showSkip ? "Finish" : "Next"}
				</Button>
				{/* <button
          onClick={(e) => {
            e.preventDefault();
            nextStep();
          }}
          className="max-w-fit h-[36px] px-[20px] outline-none text-white bg-[#305EFF] rounded-sm font-semibold text-sm"
        >
          {isPending ? "Loading..." : showSkip ? "Finish" : "Next"}
        </button> */}
			</div>
		</div>
	);
}
