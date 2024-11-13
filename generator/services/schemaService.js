import fs from "fs";

const config = JSON.parse(fs.readFileSync("config.json", "utf-8"));
const requestOptions = {
  method: "GET",
  headers: new Headers({
    authorization: `Bearer ${config.AUTH_TOKEN}`,
  }),
  redirect: "follow",
};

export const getSchema = async (resource) => {
  const response = await fetch(
    `https://api.dev.pvpc.io/i6JWTiQBFYV611VcNNWQLZ/schemas/${resource}`,
    requestOptions
  );
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }
  return await response.json();
};

export const getStringProperties = (schema) => {
  return Object.keys(schema.properties)
    .filter((key) => schema.properties[key].type === "string")
    .map((key) => ({
      name: schema.properties[key].title || key,
      value: key,
    }));
};
