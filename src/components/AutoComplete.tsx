import {
  ActionList,
  ActionListItem,
  ActionListSection,
  AutoComplete,
  Dropdown,
  DropdownOverlay,
} from "@razorpay/blade/components";

export const AutoCompleteComp = (): React.ReactElement => {
  //   const cityValues = cities.map((city) => city.value);
  //   const [filteredValues, setFilteredValues] =
  //     React.useState<string[]>(cityValues);

  return (
    <Dropdown selectionType="multiple">
      <AutoComplete
        label="City"
        placeholder="Select your City"
        name="action"
        onChange={({ name, values }) => {
          console.log({ name, values });
        }}
        onInputValueChange={({ name, value }) => {
          console.log({ name, value });
        }}
      />
      <DropdownOverlay>
        <ActionList>
          <ActionListSection title="Section Heading">
            <ActionListItem
              title="Accept API"
              value="accept"
              onClick={() => {
                console.log("Item clicked");
              }}
            />
          </ActionListSection>
          <ActionListSection title="Section Heading">
            <ActionListItem
              title="Accept API"
              value="accept"
              onClick={() => {
                console.log("Item clicked");
              }}
            />
          </ActionListSection>
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};
