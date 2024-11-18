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
    const { create, list, edit, show } = getProperties(schema);
    const listView = generateAllFields(list);
    const createView = generateAllFields(create);
    const editView = generateAllFields(edit);
    const showView = generateAllFields(show);

    generateFiles(
      resource,
      { listView, createView, editView, showView },
      projectPath
    );
    addResource(`${projectPath}/App.js`, resource, `./${resource}`);
    console.log(`Selected fields added to the '${resource}' resource.`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};
