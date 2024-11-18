import jscodeshift from "jscodeshift";
import fs from "fs";

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
        attributes: [{ name: { name: "name" }, value: { value: resourceName } }],
      },
    })
    .size();

  if (!resourceExists) {
    const adminNode = root.find(j.JSXElement, {
      openingElement: { name: { name: "Admin" } },
    });

    if (adminNode.size() > 0) {
      const resourceElement = j.jsxElement(
        j.jsxOpeningElement(
          j.jsxIdentifier("Resource"),
          [
            j.jsxAttribute(j.jsxIdentifier("name"), j.literal(resourceName)),
            j.jsxAttribute(
              j.jsxIdentifier("list"),
              j.jsxExpressionContainer(j.identifier("ProfileList"))
            ),
            j.jsxAttribute(
              j.jsxIdentifier("create"),
              j.jsxExpressionContainer(j.identifier("ProfileCreate"))
            ),
            j.jsxAttribute(
              j.jsxIdentifier("edit"),
              j.jsxExpressionContainer(j.identifier("ProfileEdit"))
            ),
            j.jsxAttribute(
              j.jsxIdentifier("show"),
              j.jsxExpressionContainer(j.identifier("ProfileShow"))
            ),
          ],
          true
        ),
        null,
        []
      );

      adminNode.forEach((path) => {
        const children = path.value.children || [];
        children.push(resourceElement);
        path.value.children = children;
      });
    }
  }

  const newCode = root.toSource();
  fs.writeFileSync(filePath, newCode, "utf-8");
}