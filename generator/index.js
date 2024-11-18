import inquirer from "inquirer";
import { addResourceFieldsCommand } from "./commands/addResource.js";

const main = async () => {
  try {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "Add a new resource",
          "Exit",
        ],
      },
    ]);

    switch (action) {
      case "Add a new resource":
        addResourceFieldsCommand();
        break;
      case "Exit":
        console.log("Goodbye!");
        process.exit(0);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

main();