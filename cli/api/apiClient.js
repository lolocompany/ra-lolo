import { config } from "../utils/config.js";

const defaultRequestOptions = {
  method: "GET",
  headers: new Headers({
    "Lolo-Api-Key": `${config.AUTH_TOKEN}`,
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