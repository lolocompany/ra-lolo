import { 
  readdirSync, 
  readFileSync, 
  writeFileSync, 
  existsSync, 
  mkdirSync 
} from "fs";
import { join, basename } from "path";
import handlebars from "handlebars";
import { pascalCase } from "change-case";
import { fixImports } from "../transformers/fixImport.js";

export function generateFiles(resourceName, components, projectPath = "./output") {
  const resourceNamePascalCase = pascalCase(resourceName);
  const templateDir = "./templates/resource";
  const outputDir = projectPath;
  const resourceDir = join(outputDir, `${resourceName}s`);

  try {
    if (!existsSync(resourceDir)) {
      mkdirSync(resourceDir, { recursive: true });
      console.log(`Created directory: ${resourceDir}`);
    }

    const templateFiles = readdirSync(templateDir);

    templateFiles.forEach((file) => {
      const templatePath = join(templateDir, file);
      const baseFileName = basename(file, ".hbs");
      const newFileName = baseFileName.includes("Resource")
        ? baseFileName.replace("Resource", resourceNamePascalCase)
        : baseFileName;
      const outputPath = join(resourceDir, newFileName);

      if (existsSync(outputPath)) {
        console.log(`File already exists: ${outputPath}, skipping...`);
        return;
      }

      const templateContent = readFileSync(templatePath, "utf-8");
      const template = handlebars.compile(templateContent);
      const inputData = { resourceName: resourceNamePascalCase, components };
      const outputContent = template(inputData);
      const importFixedContent = fixImports(outputContent);

      writeFileSync(outputPath, importFixedContent, "utf-8");
      console.log(`File generated: ${outputPath}`);
    });
  } catch (error) {
    console.error("Error generating files:", error);
  }
}