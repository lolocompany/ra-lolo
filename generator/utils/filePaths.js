import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const APP_FILE_PATH = path.resolve(
  __dirname,
  "../../../kddi-gcpa-admin/src/App.js"
);
