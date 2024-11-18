import jscodeshift from "jscodeshift";
import fs from "fs";
import Handlebars from "handlebars";
import path from "path";
import { pascalCase } from "change-case";

export function addResource(filePath, resourceName, importPath) {
  const source = fs.readFileSync(filePath, "utf-8");
  const j = jscodeshift;
  const root = j(source);

  const importExists = root.find(j.ImportDeclaration, {
    source: { value: importPath },
  }).size();

  if (!importExists) {
    const importDeclaration = j.importDeclaration(
      [
        j.importSpecifier(j.identifier("ProfileList")),
        j.importSpecifier(j.identifier("ProfileCreate")),
        j.importSpecifier(j.identifier("ProfileShow")),
        j.importSpecifier(j.identifier("ProfileEdit")),
      ],
      j.literal(importPath)
    );

    root.find(j.ImportDeclaration).at(0).insertBefore(importDeclaration);
  }
  const resourceExists = root
    .find(j.JSXElement, {
      openingElement: {
        name: { name: "Resource" },
        attributes: [{ name: { name: "name" }, value: { value: `${resourceName}s` } }],
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

      const resourceCode = resourceTemplate({ resourceName: pascalCase(resourceName) });

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