import { promptProjectPath, promptResourceDetails } from "../prompts/index.js";
import { generateFiles } from "../services/compileService.js";
import { generateAllFields } from "../services/componentService.js";
import { getProperties, getSchema } from "../services/schemaService.js";
import { addResource } from "../transformers/addResource.js";

export const generate = async () => {
  try {
    const resource = await promptResourceDetails();
    const schema = await getSchema(resource);
    const projectPath = await promptProjectPath();
    const { createViewFields, listViewFields } = getProperties(schema);
    const listView = generateAllFields(listViewFields);
    const createView = generateAllFields(createViewFields);

    generateFiles(resource, { listView, createView }, projectPath);
    addResource(`${projectPath}/App.js`, resource, `./${resource}`);
    console.log(`Selected fields added to the '${resource}' resource.`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};
