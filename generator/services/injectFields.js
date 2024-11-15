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

  // Use j.template to parse components individually and add line breaks
  const formatComponents = (components) =>
    components
      .map((component) => j.template.statement([component]).expression)
      .flatMap((component) => [j.jsxText("\n    "), component]);

  const listViewChildren = [
    ...formatComponents(selectedComponents.listView),
    j.jsxText("\n  "),
  ];

  const createViewChildren = [
    ...formatComponents(selectedComponents.createView),
    j.jsxText("\n  "),
  ];

  // Insert listView components as children inside the Datagrid
  datagridNode.get(0).node.children = listViewChildren;

  // Insert createView components as children inside the Create node
  createNode.get(0).node.children = createViewChildren;

  // Return the updated source code with proper formatting
  return root.toSource({ quote: "single", reuseWhitespace: false });
}