import { promptProjectPath, promptResourceDetails } from "../prompts/index.js";
import { getSchema } from "../services/schemaService.js";
import { createViewComponents, saveGeneratedResource } from "../utils/saveUtil.js";

export const generate = async () => {
  try {
    const resource = await promptResourceDetails();
    const projectPath = await promptProjectPath();

    const schema = await getSchema(resource);
    const views = createViewComponents(schema);

    saveGeneratedResource(resource, views, projectPath);
    
    console.log(`Resource '${resource}' successfully generated and added.`);
  } catch (error) {
    console.error("Error during resource generation:", error.message || error);
  }
};