import type { FieldError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { ORGANIZATION_KINDS } from "~/lib/types";

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
			<span className="font-semibold text-[#40566D] text-base">
				What kind of organisation are you?
			</span>
			<div className="flex w-[500px] flex-wrap gap-3">
				{ORGANIZATION_KINDS.map((item, index) => (
					<div
						key={index}
						onClick={() => onChange(item)}
						className={twMerge(
							"flex h-8 cursor-pointer items-center justify-center rounded bg-[#305EFF17] px-2 font-[500] text-xs capitalize",
							value === item
								? "bg-[#305EFF17] text-[#305EFF]"
								: "bg-[#F8FAFC] text-[#243547]",
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
