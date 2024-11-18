import { promptProjectPath, promptResourceDetails } from "../prompts/index.js";
import { generateFiles } from "../services/fileService.js";
import { generateAllFields } from "../services/genereateFIeldsService.js";
import { getProperties, getSchema } from "../services/schemaService.js";
import { addResource } from "../transformers/addResource.js";

export const addResourceFieldsCommand = async () => {
  try {
    const resource = await promptResourceDetails();
    const schema = await getSchema(resource);
    const projectPath = await promptProjectPath();
    const stringProperties = getProperties(schema);
    const selectedComponents = generateAllFields(stringProperties);

    generateFiles(resource, selectedComponents, projectPath);
    addResource(`${projectPath}/App.js`, `${resource}s`, `./${resource}`);
    console.log(`Selected fields added to the '${resource}' resource.`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};