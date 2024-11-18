import { apiClient } from "../api/apiClient.js";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("config.json", "utf-8"));

const createViewExcludeFields = [
  "createdAt",
  "updatedAt",
  "createdBy",
  "updatedBy",
  "id",
];
const listViewExcludeFields = [
  "createdAt",
  "updatedAt",
  "createdBy",
  "updatedBy",
  "id",
];

export const getSchema = async (resource) => {
  const url = `${config.BASE_URL}/schemas/${resource}`;
  return await apiClient(url);
};

export const getProperties = (schema, parentKey = "") => {
  const createViewFields = [];
  const listViewFields = [];

  Object.keys(schema.properties).forEach((key) => {
    const property = schema.properties[key];
    const fieldName = parentKey ? `${parentKey}.${key}` : key;
    const name = property.title || key;

    let componentCreate;
    let componentList;
    let choices;

    if (fieldName.endsWith("Id")) {
      componentCreate = "ReferenceInput";
      componentList = "ReferenceField";
      choices = "SelectInput";
    } else {
      switch (property.type) {
        case "string":
          if (property.enum) {
            componentCreate = "SelectInput";
            componentList = "TextField";
            choices = property.enum.map((value) => ({
              id: value,
              name: value,
            }));
          } else if (property.format === "email") {
            componentCreate = "TextInput";
            componentList = "TextField";
            choices = { type: "email" };
          } else if (property.format === "uri") {
            componentCreate = "TextInput";
            componentList = "TextField";
            choices = { type: "url" };
          } else if (property.format === "date") {
            componentCreate = "DateInput";
            componentList = "DateField";
          } else if (property.format === "date-time") {
            componentCreate = "DateTimeInput";
            componentList = "DateField";
          } else {
            componentCreate = "TextInput";
            componentList = "TextField";
          }
          break;
        case "boolean":
          componentCreate = "BooleanInput";
          componentList = "BooleanField";
          break;
        case "number":
        case "integer":
          componentCreate = "NumberInput";
          componentList = "NumberField";
          break;
        case "array":
          if (property.items) {
            if (property.items.type === "string" && property.items.enum) {
              componentCreate = "CheckboxGroupInput";
              choices = property.items.enum.map((value) => ({
                id: value,
                name: value,
              }));
            } else if (property.items.type === "string") {
              componentCreate = "ArrayInput";
              choices =
                "<SimpleFormIterator><TextInput /></SimpleFormIterator>";
            } else if (property.items.type === "object") {
              const nestedFields = getProperties(property.items, fieldName);
              createViewFields.push({
                name,
                value: fieldName,
                component: "ArrayObjectSimpleFormIterator",
                properties: nestedFields.createViewFields,
              });
           
              return;
            } else {
              componentCreate = "ArrayInput";
              componentList = "TextField";
              choices =
                "<SimpleFormIterator>{ /* other inputs */ }</SimpleFormIterator>";
            }
          }
          break;
        case "object":
          const nestedFields = getProperties(property, fieldName);
          createViewFields.push({
            name,
            value: fieldName,
            component: "NestedObjectSection",
            properties: nestedFields.createViewFields,
          });
          return;
        default:
          componentCreate = "TextInput";
          componentList = "TextField";
      }
    }

    if (!createViewExcludeFields.includes(fieldName)) {
      createViewFields.push({
        name,
        value: fieldName,
        component: componentCreate,
        ...(choices && { choices }),
      });
    }

    if (!listViewExcludeFields.includes(fieldName)) {
      listViewFields.push({
        name,
        value: fieldName,
        component: componentList,
      });
    }
  });

  return { createViewFields, listViewFields };
};
