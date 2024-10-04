import {
  Dropdown,
  DropdownOverlay,
  SelectInput,
  ActionList,
  ActionListItem,
} from "@razorpay/blade/components";

export function DropSelect({
  label,
  placeholder,
  name,
  onChange,
  list,
}: {
  label: string;
  placeholder: string;
  name: string;
  onChange: (data: any) => void;
  list: Array<string>;
}): React.ReactElement {
  return (
    <Dropdown selectionType="single">
      <SelectInput
        label={label}
        placeholder={placeholder}
        name={name}
        onChange={({ name, values }) => {
          console.log({ name, values });
          onChange({ name, values });
        }}
      />
      <DropdownOverlay>
        <ActionList>
          {list.map((item, index) => (
            <ActionListItem key={index} title={item} value={item} />
          ))}
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
}
