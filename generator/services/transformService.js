import jscodeshift from "jscodeshift";
import transform from "../addDatagridFields.js";

export const applyTransformation = (
  sourceCode,
  selectedComponents,
  resource
) => {
  const root = jscodeshift(sourceCode);
  transform(root, jscodeshift, selectedComponents, resource);
  return root.toSource();
};
