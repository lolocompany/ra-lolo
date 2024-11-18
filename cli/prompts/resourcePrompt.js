import inquirer from "inquirer";
export const resourcePrompt = async () => {
  const { resource } = await inquirer.prompt([
    {
      type: "input",
      name: "resource",
      message: "Enter the name of the resource to add fields to:",
    },
  ]);
  return resource;
};
