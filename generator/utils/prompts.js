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

export const promptFieldSelection = async (stringProperties) => {
  const { selectedFields } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedFields",
      message: "Select the components you want to add to the Datagrid:",
      choices: stringProperties.map((prop) => ({
        name: `<TextField source='${prop.value}' />`,
        value: prop.value,
      })),
    },
  ]);

  const listViewFields = selectedFields.map((field) => `<TextField source='${field}' />`);
  const createViewFields = selectedFields.map((field) => `<TextInput source='${field}' />`);

  return {
    listView: listViewFields,
    createView: createViewFields,
  };
};