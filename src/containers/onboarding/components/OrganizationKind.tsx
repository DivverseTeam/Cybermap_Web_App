import { twMerge } from "tailwind-merge";
import { ORGANIZATION_KINDS } from "~/lib/types";
import { FieldError } from "react-hook-form";

type OrganizationSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  errors?: FieldError;
};

export function OrganizationKind({
  value,
  onChange,
  errors,
}: OrganizationSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-semibold text-base text-[#40566D]">
        What kind of organisation are you?
      </span>
      <div className="flex flex-wrap gap-3 w-[500px]">
        {ORGANIZATION_KINDS.map((item, index) => (
          <div
            key={index}
            onClick={() => onChange(item)}
            className={twMerge(
              "rounded h-8 px-2 bg-[#305EFF17] font-[500] text-xs flex items-center justify-center capitalize cursor-pointer",
              value === item
                ? "bg-[#305EFF17] text-[#305EFF]"
                : "bg-[#F8FAFC] text-[#243547]"
            )}
          >
            {item.toLowerCase().replace(/_/g, " ")}
          </div>
        ))}
      </div>
      {errors && (
        <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
          {errors.message}
        </p>
      )}
    </div>
  );
}
