import inquirer from "inquirer";
export const promptProjectPath = async () => {
  const { projectPath } = await inquirer.prompt([
    {
      type: "input",
      name: "projectPath",
      message: "Enter the path to the project:",
    },
  ]);
  return projectPath;
};
