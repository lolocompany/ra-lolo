import { readFileSync, writeFileSync } from "fs";
import handlebars from "handlebars";

export function generateResourceList(components, datagridComponents) {
  const templatePath = "./templates/ResourceList.js.hbs";
  const outputPath = "./output.js";

  try {
    const templateContent = readFileSync(templatePath, "utf-8");
    const template = handlebars.compile(templateContent);

    const inputData = { components, datagridComponents };
    const outputContent = template(inputData);

    writeFileSync(outputPath, outputContent, "utf-8");

    console.log(`File generated at: ${outputPath}`);
  } catch (error) {
    console.error("Error generating resource list:", error);
  }
}
