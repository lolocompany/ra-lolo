import inquirer from "inquirer";

export const promptResourceDetails = async () => {
  const { resource } = await inquirer.prompt([
    {
      type: "input",
      name: "resource",
      message: "Enter the name of the resource to add fields to:",
    },
  ]);
  return resource;
};
export const promptFieldSelection = async (properties) => {
  const { selectedFields } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedFields",
      message: "Select the components you want to add to the Datagrid:",
      choices: properties
        .map((prop) => {
          const isReference = prop.component === "ReferenceField";
          const isArrayEnum = prop.component === "CheckboxGroupInput";
          const listViewComponent = isReference
            ? "ReferenceField"
            : isArrayEnum
            ? "ChipField"
            : prop.component === "DateTimeInput"
            ? "DateField"
            : prop.component.replace("Input", "Field");

          return {
            name: `${prop.name} (${listViewComponent} / ${prop.component})`,
            value: prop,
          };
        }),
    },
  ]);

  const listViewFields = selectedFields
    .filter((field) => field.component !== "NestedObjectSection" && field.component !== "ArrayObjectSimpleFormIterator") // Exclude nested objects and array of objects from List view
    .map((field) => {
      if (field.component === "ReferenceInput") {
        return `<ReferenceField source="${field.value}" reference="${field.value.replace(/Id$/, "s")}">
          <TextField source="name" />
        </ReferenceField>`;
      }
      
      const isArrayEnum = field.component === "CheckboxGroupInput";
      const listViewComponent = isArrayEnum
        ? "ChipField"
        : field.component === "DateTimeInput"
        ? "DateField"
        : field.component.replace("Input", "Field");

      return `<${listViewComponent} source="${field.value}" />`;
    });
  const createViewFields = selectedFields.map((field) => {
    if (field.component === "NestedObjectSection") {
      return (
        `<>` +
        `<h3>${field.name}</h3>` +
        `${field.properties.map((nestedField) => `<${nestedField.component} source='${nestedField.value}' />`).join("\n")}` +
        `</>`
      );
    }
    
    if (field.component === "ArrayObjectSimpleFormIterator") {
      return (
        `<>` +
        `<ArrayInput source="${field.value}">` +
        `<SimpleFormIterator>` +
        `${field.properties.map((nestedField) => `<${nestedField.component} source="${nestedField.value}" />`).join("\n")}` +
        `</SimpleFormIterator>` +
        `</ArrayInput>` +
        `</>`
      );
    }

    if (field.component === "ReferenceInput") {
      return `<ReferenceInput source="${field.value}" reference="${field.value.replace(/Id$/, "s")}">
        <SelectInput optionText="name" />
      </ReferenceInput>`;
    }

    const isArrayEnum = field.component === "CheckboxGroupInput";
    return isArrayEnum
      ? `<CheckboxGroupInput source='${field.value}' choices={${JSON.stringify(field.choices)}} />`
      : `<${field.component} source='${field.value}'${field.choices ? ` choices={${JSON.stringify(field.choices)}}` : ""} />`;
  });

  return {
    listView: listViewFields,
    createView: createViewFields,
  };
};