const { JSCodeshift } = require("jscodeshift");

module.exports = function (fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Import the selected components to insert into the Datagrid
  const selectedComponents = require("./selectedComponents.js");
  console.log("Looking for the Datagrid node...");

  // Find the Datagrid component in the profiles resource
  const datagridNode = root
    .find(j.JSXElement, {
      openingElement: {
        name: {
          name: "Datagrid",
        },
      },
    })
    .at(0); // Target the first Datagrid component
  console.log("Datagrid node found:", datagridNode.length);

  if (!datagridNode.length) {
    console.log("No Datagrid element found.");
    return fileInfo.source;
  }

  // Wrap selected components in a fragment to allow multiple elements
  const wrappedComponents = `<>${selectedComponents}</>`;
  const newChildren = j(wrappedComponents).find(j.JSXElement).nodes();

  if (!newChildren.length) {
    console.log("No valid JSX elements found in selectedComponents.");
    return fileInfo.source;
  }

  // Insert the generated components as children inside the Datagrid
  datagridNode.get(0).node.children.push(...newChildren);

  // Return the updated source code
  return root.toSource();
};
