import { apiClient } from "../utils/apiClient.js";

export const getSchema = async (resource) => {
  const url = `https://api.dev.pvpc.io/i6JWTiQBFYV611VcNNWQLZ/schemas/${resource}`;
  return await apiClient(url);
};

export const getStringProperties = (schema) => {
  return Object.keys(schema.properties)
    .filter((key) => schema.properties[key].type === "string")
    .map((key) => ({
      name: schema.properties[key].title || key,
      value: key,
    }));
};