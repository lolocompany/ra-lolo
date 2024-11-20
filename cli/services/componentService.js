export const generateFields = (properties, disableChoices = false) => {
  return properties.map((field) => {
    // Handle NestedObjectSection
    if (field.component === "NestedObjectSection") {
      const nestedFields = field.properties
        .map(
          (nestedField) =>
            `<${nestedField.component} source="${nestedField.value}" />`
        )
        .join("\n");
      return `<> 
        <h3>${field.name}</h3>
        ${nestedFields}
      </>`;
    }

    // Handle ArrayObjectSimpleFormIterator
    if (field.component === "ArrayObjectSimpleFormIterator") {
      return `<> 
        <ArrayInput source="${field.value}">
          <SimpleFormIterator>
            ${generateFields(field.items).join("\n")}
          </SimpleFormIterator>
        </ArrayInput>
      </>`;
    }

    // Handle ReferenceField for listView
    if (field.component === "ReferenceField") {
      return `<ReferenceField source="${
        field.value
      }" reference="${field.value.replace(/Id$/, "s")}">
        <TextField source="name" />
      </ReferenceField>`;
    }

    // Handle ReferenceInput for createView
    if (field.component === "ReferenceInput") {
      return `<ReferenceInput source="${
        field.value
      }" reference="${field.value.replace(/Id$/, "s")}">
          <AutocompleteInput source="devices" optionText="name" />
      </ReferenceInput>`;
    }

    // Handle CheckboxGroupInput for createView
    if (field.component === "CheckboxGroupInput") {
      return `<CheckboxGroupInput source="${field.value}"${
        !disableChoices ? ` choices={${JSON.stringify(field.choices)}}` : ""
      } />`;
    }

    // Handle CheckboxGroupField for listView
    if (field.component === "CheckboxGroupField") {
      return `<ChipField source="${field.value}" />`;
    }

    // Handle other components
    return `<${field.component} source="${field.value}"${
      field.choices && !disableChoices
        ? ` choices={${JSON.stringify(field.choices)}}`
        : ""
    } />`;
  });
};
