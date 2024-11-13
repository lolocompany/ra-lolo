export default function transform(
  root,
  jscodeshift,
  selectedComponents,
  resource
) {
  const j = jscodeshift;

  console.log("Looking for the Datagrid and Create nodes...");

  // Find the Resource node with the specified name
  const resourceNode = root
    .find(j.JSXElement, {
      openingElement: { name: { name: "Resource" } },
    })
    .filter((path) =>
      path.node.openingElement.attributes.some(
        (attr) =>
          attr.name &&
          attr.name.name === "name" &&
          attr.value.value === `${resource}s`
      )
    );

  // Find the Datagrid component within the specified resource
  const datagridNode = resourceNode
    .find(j.JSXElement, {
      openingElement: {
        name: {
          name: "Datagrid",
        },
      },
    })
    .at(0);

  // Find the Create component within the specified resource
  const createNode = resourceNode
    .find(j.JSXElement, {
      openingElement: {
        name: {
          name: "Create",
        },
      },
    })
    .find(j.JSXElement, {
      openingElement: {
        name: {
          name: "SimpleForm",
        },
      },
    })
    .at(0);

  console.log("Datagrid node found:", datagridNode.length);
  console.log("Create node found:", createNode.length);

  if (!datagridNode.length) {
    console.log("No Datagrid element found.");
    return root.source;
  }

  if (!createNode.length) {
    console.log("No Create element found.");
    return root.source;
  }

  // Wrap listView components in a fragment for the Datagrid
  const listViewComponents = `<>${selectedComponents.listView.join("")}</>`;
  const listViewChildren = j(listViewComponents).find(j.JSXElement).nodes();

  // Wrap createView components in a fragment for the Create node
  const createViewComponents = `<>${selectedComponents.createView.join("")}</>`;
  const createViewChildren = j(createViewComponents).find(j.JSXElement).nodes();

  if (!listViewChildren.length) {
    console.log("No valid JSX elements found in selectedComponents.listView.");
    return root.source;
  }

  if (!createViewChildren.length) {
    console.log(
      "No valid JSX elements found in selectedComponents.createView."
    );
    return root.source;
  }

  // Insert listView components as children inside the Datagrid
  datagridNode.get(0).node.children.push(...listViewChildren);

  // Insert createView components as children inside the Create node
  createNode.get(0).node.children.push(...createViewChildren);

  // Return the updated source code
  return root.toSource();
}
