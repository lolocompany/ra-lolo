const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { program } = require("commander");
const inquirer = require("inquirer").createPromptModule(); // Updated for v12

const APP_FILE_PATH = path.resolve(
  __dirname,
  "../../kddi-gcpa-admin/src/App.js"
);

program
  .command("add-profile-fields")
  .description("Add fields to profiles resource")
  .action(async () => {
    try {
      // Step 1: Confirm if user wants to add fields
      const { confirmAddFields } = await inquirer([
        {
          type: "confirm",
          name: "confirmAddFields",
          message:
            "This will add fields to the 'profiles' resource. Do you want to continue?",
          default: true,
        },
      ]);

      if (!confirmAddFields) {
        console.log("Aborted. No changes made to the profiles resource.");
        return;
      }

      // Step 2: Select fields to add
      const { selectedFields } = await inquirer([
        {
          type: "checkbox",
          name: "selectedFields",
          message: "Select the components you want to add to the Datagrid:",
          choices: [
            { name: "<TextField source='id' />", value: "TextField id" },
            { name: "<TextField source='name' />", value: "TextField name" },
            { name: "<TextField source='email' />", value: "TextField email" },
            { name: "<EditButton />", value: "EditButton" },
            { name: "<ShowButton />", value: "ShowButton" },
          ],
        },
      ]);

      // Map selected fields to actual JSX components
      const selectedComponents = selectedFields
        .map((field) => {
          switch (field) {
            case "TextField id":
              return "<TextField source='id' />";
            case "TextField name":
              return "<TextField source='name' />";
            case "TextField email":
              return "<TextField source='email' />";
            case "EditButton":
              return "<EditButton />";
            case "ShowButton":
              return "<ShowButton />";
            default:
              return "";
          }
        })
        .join("\n");

      // Write selected components to a temporary file
      const tempFilePath = path.resolve(__dirname, "selectedComponents.js");
      fs.writeFileSync(
        tempFilePath,
        `module.exports = \`${selectedComponents}\`;`
      );
      console.log("running the jscodeshift");
      // Step 3: Run the jscodeshift transformation using npx
      const command = `npx jscodeshift -t ${path.resolve(
        __dirname,
        "addDatagridFields.js"
      )} ${APP_FILE_PATH}`;

      exec(command, (error, stdout, stderr) => {
        console.log("Running command:", command);

        if (error) {
          console.error("Error during transformation:", stderr);
        } else {
          console.log("Transformation output:", stdout);
          console.log("Selected fields added to profiles resource.");
        }
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  });

program.parse(process.argv);
