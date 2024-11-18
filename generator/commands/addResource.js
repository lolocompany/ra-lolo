import { promptResourceDetails, promptProjectPath } from "../utils/prompts.js";
import { addResource } from "../utils/addResource.js";
import { getProperties, getSchema } from "../services/schemaService.js";
import { generateAllFields } from "../services/genereateFIeldsService.js";
import { generateFiles } from "../services/fileGeneratorService.js";
import { APP_FILE_PATH } from "../utils/filePaths.js";

export const addResourceFieldsCommand = async () => {
  try {
    const resource = await promptResourceDetails();
    const schema = await getSchema(resource);
    const projectPath = await promptProjectPath();
    const stringProperties = getProperties(schema);
    const selectedComponents = generateAllFields(stringProperties);

    generateFiles(resource, selectedComponents, projectPath);
    addResource(APP_FILE_PATH, `${resource}s`, `./${resource}`);
    console.log(`Selected fields added to the '${resource}' resource.`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};