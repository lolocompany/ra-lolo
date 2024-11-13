import fs from "fs";


const config = JSON.parse(fs.readFileSync("config.json", "utf-8"));


const defaultRequestOptions = {
  method: "GET",
  headers: new Headers({
    'Lolo-Api-Key': `${config.AUTH_TOKEN}`,
  }),
  redirect: "follow",
};


export const apiClient = async (url, options = {}) => {
  const combinedOptions = {
    ...defaultRequestOptions,
    ...options, 
  };

  const response = await fetch(url, combinedOptions);

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText} for ${url}`);
  }

  return await response.json();
};