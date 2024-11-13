import { program } from 'commander';
import { promptResourceDetails, promptFieldSelection } from '../utils/prompts.js';
import { getSchema, getStringProperties } from '../services/schemaService.js';
import { applyTransformation } from '../services/transformService.js';
import { APP_FILE_PATH } from '../utils/filePaths.js';
import fs from 'fs';

export const addResourceFieldsCommand = () => {
  program
    .command("add-resource-fields")
    .description("Add fields to a specified resource")
    .action(async () => {
      try {
        const resource = await promptResourceDetails();
        const schema = await getSchema(resource);
        
        const stringProperties = getStringProperties(schema);
        const selectedComponents = await promptFieldSelection(stringProperties);

        const sourceCode = fs.readFileSync(APP_FILE_PATH, "utf-8");
        const transformedCode = applyTransformation(sourceCode, selectedComponents, resource);
        
        fs.writeFileSync(APP_FILE_PATH, transformedCode, "utf-8");
        console.log(`Selected fields added to the '${resource}' resource.`);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    });
};