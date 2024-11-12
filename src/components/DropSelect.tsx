import {
  ActionList,
  ActionListItem,
  Dropdown,
  DropdownOverlay,
  SelectInput,
} from "@razorpay/blade/components";
import { Controller, type FieldError } from "react-hook-form";

export function DropSelect({
  label,
  placeholder,
  name,
  list,
  control,
  errors,
}: {
  label: string;
  placeholder: string;
  name: string;
  list: string[];
  control: any;
  errors?: FieldError;
}): React.ReactElement {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-semibold text-[#40566D] text-base">{label}</span>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Dropdown selectionType="single">
            <SelectInput
              label=""
              placeholder={placeholder}
              value={value}
              validationState={errors ? "error" : "none"}
              onChange={({ values }) => {
                onChange(values[0]);
              }}
            />
            <DropdownOverlay>
              <ActionList>
                {list.map((item, index) => (
                  <ActionListItem
                    key={item + String(index)}
                    title={item.toLowerCase().replace(/_/g, " ")}
                    value={item}
                  />
                ))}
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        )}
      />
      {errors && (
        <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
          {errors.message}
        </p>
      )}
    </div>
  );
}
