import jscodeshift from 'jscodeshift';
import * as reactAdminExports from 'react-admin'; // Import all exports from react-admin

/**
 * Fix imports in the given file content to ensure all JSX elements
 * are imported from 'react-admin' only if they are exported by it.
 *
 * @param {string} fileContent - The source code as a string.
 * @returns {string} - The transformed source code.
 */
export function fixImports(fileContent) {
    const transformer = (file, api) => {
        const j = api.jscodeshift;
        const root = j(file.source);

        // Step 1: Collect all JSX elements used in the file
        const jsxElements = new Set();

        root.find(j.JSXElement).forEach((path) => {
            const tagName = path.node.openingElement.name;
            if (tagName.type === 'JSXIdentifier') {
                jsxElements.add(tagName.name);
            }
        });

        // Step 2: Filter elements that are exported by 'react-admin'
        const reactAdminComponents = new Set(
            Object.keys(reactAdminExports) // Get all exports from react-admin
        );
        const validElements = [...jsxElements].filter((element) =>
            reactAdminComponents.has(element)
        );

        // Step 3: Remove existing import statements for these elements
        root.find(j.ImportDeclaration).forEach((path) => {
            const importedSpecifiers = path.node.specifiers.map((spec) => spec.local.name);
            if (importedSpecifiers.some((name) => validElements.includes(name))) {
                j(path).remove();
            }
        });

        // Step 4: Add a new import statement for valid elements from 'react-admin'
        if (validElements.length > 0) {
            const newImport = j.importDeclaration(
                validElements.map((name) => j.importSpecifier(j.identifier(name))),
                j.literal('react-admin')
            );
            root.get().node.program.body.unshift(newImport);
        }

        return root.toSource();
    };

    const file = { source: fileContent };
    const api = { jscodeshift };

    return transformer(file, api);
}