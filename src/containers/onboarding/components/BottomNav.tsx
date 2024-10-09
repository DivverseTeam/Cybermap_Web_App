import { twMerge } from "tailwind-merge";

export function BottomNav({
  nextStep,
  previousStep,
  showSkip,
  hasPrevious = true,
}: {
  previousStep: () => void;
  nextStep: () => void;
  showSkip?: boolean;
  hasPrevious?: boolean;
}) {
  return (
    <div
      className={twMerge(
        "w-full flex items-center gap-4",
        showSkip ? "justify-between" : "justify-end"
      )}
    >
      {showSkip && (
        <span className="font-semibold text-base text-[#305EFF] leading-8 cursor-pointer">
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
            "max-w-fit h-[36px] px-[20px] outline-none  rounded-sm font-semibold text-sm text-[#243547] border border-solid border-[#CBD5E2]",
            hasPrevious
              ? "cursor-pointer"
              : "cursor-not-allowed text-gray-1 bg-gray-1"
          )}
        >
          Back
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            nextStep();
          }}
          className="max-w-fit h-[36px] px-[20px] outline-none text-white bg-[#305EFF] rounded-sm font-semibold text-sm"
        >
          {showSkip ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
