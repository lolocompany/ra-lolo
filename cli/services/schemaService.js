import { getComponentByType } from "../utils/getComponentByType.js";
import { EXCLUDE_FIELDS } from "../utils/excludeFields.js";
import { apiClient } from "../api/apiClient.js";
import { config } from "../utils/config.js";

export const getSchema = async (resource) => {
  const url = `${config.BASE_URL}/schemas/${resource}`;
  return await apiClient(url);
};
export const getProperties = (schema, parentKey = "") => {
  const views = {
    create: [],
    list: [],
    edit: [],
    show: [],
    filter: [],
  };

  Object.keys(schema.properties).forEach((key) => {
    const property = schema.properties[key];
    const fieldName = parentKey ? `${parentKey}.${key}` : key;
    const name = property.title || key;

    const components = getComponentByType(property, fieldName);

    if (property.type === "object") {
      const nestedViews = getProperties(property, fieldName);

      Object.entries(views).forEach(([view, fields]) => {
        if (
          !EXCLUDE_FIELDS[view].includes(fieldName) &&
          components[view] !== null
        ) {
          fields.push({
            name,
            value: fieldName,
            component: components[view],
            properties: nestedViews[view],
          });
        }
      });
    } else if (
      property.type === "array" &&
      property.items &&
      property.items.type === "object"
    ) {
      const nestedViews = getProperties(property.items, fieldName);
      Object.entries(views).forEach(([view, fields]) => {
        if (
          !EXCLUDE_FIELDS[view].includes(fieldName) &&
          components[view] !== null
        ) {
          fields.push({
            name,
            value: fieldName,
            component: components[view],
            items: nestedViews[view],
          });
        }
      });
    } else {
      Object.entries(views).forEach(([view, fields]) => {
        if (
          !EXCLUDE_FIELDS[view].includes(fieldName) &&
          components[view] !== null
        ) {
          fields.push({
            name,
            value: fieldName,
            component: components[view],
            ...(components.choices && { choices: components.choices }),
          });
        }
      });
    }
  });

  return views;
};
