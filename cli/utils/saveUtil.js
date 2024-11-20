import { generateFields } from "../services/componentService.js";
import { getProperties } from "../services/schemaService.js";
import { generateFiles } from "../services/compileService.js";
import { addResource } from "../transformers/addResource.js";

export const createViewComponents = (schema) => {
  const { create, list, edit, show, filter } = getProperties(schema);

  return {
    listView: generateFields(list, true),
    createView: generateFields(create),
    editView: generateFields(edit),
    showView: generateFields(show, true),
    filterView: generateFields(filter),
  };
};

export const saveGeneratedResource = (resource, views, projectPath) => {
  generateFiles(resource, views, projectPath);
  addResource(`${projectPath}/App.js`, resource, `./${resource}s`);
};
