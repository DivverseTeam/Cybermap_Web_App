import { TextInput, type TextInputProps } from "@razorpay/blade/components";
import { Controller, type FieldError, type UseControllerProps } from "react-hook-form";

type InputProps = UseControllerProps<any> & {
  name: string;
  label: string;
  placeholder?: string;
  type?: TextInputProps["type"];
  errors?: FieldError;
};

export function AppInput({
  name,
  label,
  placeholder,
  type,
  errors,
  ...controllerProps
}: InputProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-semibold text-base text-[#40566D]">{label}</span>
      <Controller
        name={name}
        {...controllerProps}
        render={({ field: { onChange, value } }) => {
          return (
            <TextInput
              placeholder={placeholder || "Enter value"}
              accessibilityLabel={label}
              labelPosition="top"
              type={type || "text"}
              validationState={errors ? "error" : "none"}
              value={value ?? ""}
              onChange={(input) => onChange(input.value)}
            />
          );
        }}
      />
      {errors && (
        <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
          {errors.message}
        </p>
      )}
    </div>
  );
}
