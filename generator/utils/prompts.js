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
      choices: properties.map((prop) => ({
        name: `${prop.name} (${prop.component})`,
        value: prop,
      })),
    },
  ]);

  const listViewFields = selectedFields.map((field) => {
    const listViewComponent =
      field.component === "DateTimeInput"
        ? "DateField"
        : field.component.replace("Input", "Field");
    return `<${listViewComponent} source='${field.value}' />`;
  });
  const createViewFields = selectedFields.map(
    (field) =>
      `<${field.component} source='${field.value}'${
        field.choices ? ` choices={${JSON.stringify(field.choices)}}` : ""
      } />`
  );

  return {
    listView: listViewFields,
    createView: createViewFields,
  };
};
