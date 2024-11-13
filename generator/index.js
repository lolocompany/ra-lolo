import { program } from "commander";

import { addResourceFieldsCommand } from "./commands/addResourceFields.js";

addResourceFieldsCommand();

program.parse(process.argv);
