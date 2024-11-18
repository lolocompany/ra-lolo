import jscodeshift from "jscodeshift";
import fs from "fs";
import Handlebars from "handlebars";
import path from "path";

export function addResource(filePath, resourceName, importPath) {
  const source = fs.readFileSync(filePath, "utf-8");
  const j = jscodeshift;
  const root = j(source);

  const resourceExists = root
    .find(j.JSXElement, {
      openingElement: {
        name: { name: "Resource" },
        attributes: [{ name: { name: "name" }, value: { value: resourceName } }],
      },
    })
    .size();

  if (!resourceExists) {
    const adminNode = root.find(j.JSXElement, {
      openingElement: { name: { name: "Admin" } },
    });

    if (adminNode.size() > 0) {
      
      const templatePath = path.resolve("./templates/resourceComponent.jsx.hbs");
      const templateContent = fs.readFileSync(templatePath, "utf-8");
      const resourceTemplate = Handlebars.compile(templateContent);

      const resourceCode = resourceTemplate({ resourceName });

      const resourceElement = j(resourceCode).nodes();

      adminNode.forEach((path) => {
        const children = path.value.children || [];
        children.push(...resourceElement);
        path.value.children = children;
      });
    }
  }

  const newCode = root.toSource();
  fs.writeFileSync(filePath, newCode, "utf-8");
}