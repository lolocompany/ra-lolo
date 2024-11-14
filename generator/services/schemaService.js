import { apiClient } from "../utils/apiClient.js";

export const getSchema = async (resource) => {
  const url = `https://api.dev.pvpc.io/i6JWTiQBFYV611VcNNWQLZ/schemas/${resource}`;
  return await apiClient(url);
};

export const getProperties = (schema) => {
  return Object.keys(schema.properties).map((key) => {
    const property = schema.properties[key];
    const name = property.title || key;
    let component;
    let choices;

    switch (property.type) {
      case "string":
        if (property.enum) {
          component = "SelectInput";
          choices = property.enum.map((value) => ({ id: value, name: value }));
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
        if (property.items && property.items.type === "string") {
          component = "ArrayInput";
          choices = "<SimpleFormIterator><TextInput /></SimpleFormIterator>";
        } else {
          component = "ArrayInput";
          choices = "<SimpleFormIterator>{ /* other inputs */ }</SimpleFormIterator>";
        }
        break;

      // case "object":
      //   component = "ObjectInput";
      //   break;

      default:
        component = "TextInput";
    }

    return {
      name,
      value: key,
      component,
      ...(choices && { choices }),
    };
  }).filter(Boolean);
};