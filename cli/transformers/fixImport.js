import jscodeshift from "jscodeshift";
import * as reactAdminExports from "react-admin";

export function fixImports(fileContent) {
  const transformer = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source);

    const jsxElements = new Set();
    root.find(j.JSXElement).forEach((path) => {
      const tagName = path.node.openingElement.name;
      if (tagName.type === "JSXIdentifier") {
        jsxElements.add(tagName.name);
      }
    });

    const reactAdminComponents = new Set(Object.keys(reactAdminExports));
    const validElements = [...jsxElements].filter((element) =>
      reactAdminComponents.has(element)
    );

    root.find(j.ImportDeclaration).forEach((path) => {
      const importedSpecifiers = path.node.specifiers.map((spec) => spec.local.name);
      if (importedSpecifiers.some((name) => validElements.includes(name))) {
        j(path).remove();
      }
    });

    if (validElements.length > 0) {
      const newImport = j.importDeclaration(
        validElements.map((name) => j.importSpecifier(j.identifier(name))),
        j.literal("react-admin")
      );
      root.get().node.program.body.unshift(newImport);
    }

    return root.toSource();
  };

  const file = { source: fileContent };
  const api = { jscodeshift };

  return transformer(file, api);
}