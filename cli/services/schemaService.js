import { apiClient } from "../api/apiClient.js";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("config.json", "utf-8"));

export const getSchema = async (resource) => {
  const url = `${config.BASE_URL}/schemas/${resource}`;
  return await apiClient(url);
};

export const getProperties = (schema, parentKey = "") => {
  const fields = [];

  Object.keys(schema.properties).forEach((key) => {
    const property = schema.properties[key];
    const fieldName = parentKey ? `${parentKey}.${key}` : key;
    const name = property.title || key;
    let component;
    let choices;

    if (fieldName.endsWith("Id")) {
      component = "ReferenceInput";
      choices = "SelectInput";
    } else {
      switch (property.type) {
        case "string":
          if (property.enum) {
            component = "SelectInput";
            choices = property.enum.map((value) => ({
              id: value,
              name: value,
            }));
          } else if (property.format === "email") {
            component = "TextInput";
            choices = { type: "email" };
          } else if (property.format === "uri") {
            component = "TextInput";
            choices = { type: "url" };
          } else if (property.format === "date") {
            component = "DateInput";
          } else if (property.format === "date-time") {
            component = "DateTimeInput";
          } else {
            component = "TextInput";
          }
          break;
        case "boolean":
          component = "BooleanInput";
          break;
        case "number":
        case "integer":
          component = "NumberInput";
          break;
        case "array":
          if (property.items) {
            if (property.items.type === "string" && property.items.enum) {
              component = "CheckboxGroupInput";
              choices = property.items.enum.map((value) => ({
                id: value,
                name: value,
              }));
            } else if (property.items.type === "string") {
              component = "ArrayInput";
              choices =
                "<SimpleFormIterator><TextInput /></SimpleFormIterator>";
            } else if (property.items.type === "object") {
              const nestedFields = getProperties(property.items, fieldName);
              fields.push({
                name,
                value: fieldName,
                component: "ArrayObjectSimpleFormIterator",
                properties: nestedFields,
              });
              return;
            } else {
              component = "ArrayInput";
              choices =
                "<SimpleFormIterator>{ /* other inputs */ }</SimpleFormIterator>";
            }
          }
          break;
        case "object":
          fields.push({
            name,
            value: fieldName,
            component: "NestedObjectSection",
            properties: getProperties(property, fieldName),
          });
          return;
        default:
          component = "TextInput";
      }
    }

    fields.push({
      name,
      value: fieldName,
      component,
      ...(choices && { choices }),
    });
  });

  return fields;
};
