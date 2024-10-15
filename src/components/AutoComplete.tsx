import {
  ActionList,
  ActionListItem,
  ActionListSection,
  AutoComplete,
  Dropdown,
  DropdownOverlay,
} from "@razorpay/blade/components";
import { Controller, type FieldError } from "react-hook-form";

export const AutoCompleteComp = ({
  listData,
  label,
  errors,
  name,
  placeholder,
  control,
}: {
  listData: any[];
  label: string;
  name: string;
  placeholder: string;
  control: any;
  errors?: FieldError;
}): React.ReactElement => {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-semibold text-base text-[#40566D]">{label}</span>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Dropdown selectionType="multiple">
            <AutoComplete
              label=""
              placeholder={placeholder}
              name="action"
              value={value}
              validationState={errors ? "error" : "none"}
              onChange={({ name, values }) => {
                console.log({ name, values });
                onChange(values);
              }}
            />
            <DropdownOverlay>
              <ActionList>
                {listData.map((item, index) => (
                  <ActionListSection
                    title={item.title}
                    key={item.title + String(index)}
                  >
                    {item.list.map((subItem: string, subIndex: number) => (
                      <ActionListItem
                        key={subItem + String(subIndex)}
                        title={subItem}
                        value={subItem.toLowerCase()}
                      />
                    ))}
                  </ActionListSection>
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
};
