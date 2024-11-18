import {
  readdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
} from "fs";
import { join, basename } from "path";
import handlebars from "handlebars";
import { pascalCase } from "change-case";
import { fixImports } from '../utils/fixImport.js'
export function generateFiles(
  resourceName,
  components,
  projectPath
) {
  const pascalCasepascalCase = pascalCase(resourceName)
  const templateDir = "./templates/resource";
  const outputDir = projectPath || "./output";

  // Create a subdirectory for the specific resource
  const resourceDir = join(outputDir, resourceName);

  try {
    // Ensure the resource-specific directory exists
    if (!existsSync(resourceDir)) {
      mkdirSync(resourceDir, { recursive: true });
    }

    // Read all template files in the directory
    const templateFiles = readdirSync(templateDir);

    templateFiles.forEach((file) => {
      const templatePath = join(templateDir, file);

      // Determine the output filename
      const baseFileName = basename(file, ".hbs"); // Remove .hbs extension
      const newFileName = baseFileName.includes("Resource")
        ? baseFileName.replace("Resource", pascalCasepascalCase) // Replace "Resource" with resourceName
        : baseFileName; // Keep the original name if "Resource" is not present

      const outputPath = join(resourceDir, `${newFileName}`);

      // Check if the file already exists
      if (existsSync(outputPath)) {
        console.log(`File already exists: ${outputPath}, skipping...`);
        return; // Skip file generation if it exists
      }

      // Read the template content
      const templateContent = readFileSync(templatePath, "utf-8");
      const template = handlebars.compile(templateContent);

      // Input data for the template
      const inputData = { resourceName: pascalCasepascalCase, components };

      // Generate output content
      const outputContent = template(inputData);
      const importFixed = fixImports(outputContent)

      // Write to the output file
      writeFileSync(outputPath, importFixed, "utf-8");

      console.log(`File generated: ${outputPath}`);
    });
  } catch (error) {
    console.error("Error generating files:", error);
  }
}