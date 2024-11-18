export const getComponentByType = (property, fieldName) => {
    if (fieldName.endsWith("Id")) {
      return {
        create: "ReferenceInput",
        list: "ReferenceField",
        edit: "ReferenceInput",
        show: "ReferenceField",
        choices: "SelectInput",
      };
    }
  
    switch (property.type) {
      case "string":
        if (property.enum) {
          return {
            create: "SelectInput",
            list: "TextField",
            edit: "SelectInput",
            show: "TextField",
            choices: property.enum.map((value) => ({ id: value, name: value })),
          };
        }
        if (property.format === "email") {
          return {
            create: "TextInput",
            list: "TextField",
            edit: "TextInput",
            show: "TextField",
            choices: { type: "email" },
          };
        }
        if (property.format === "uri") {
          return {
            create: "TextInput",
            list: "TextField",
            edit: "TextInput",
            show: "TextField",
            choices: { type: "url" },
          };
        }
        if (property.format === "date") {
          return {
            create: "DateInput",
            list: "DateField",
            edit: "DateInput",
            show: "DateField",
          };
        }
        if (property.format === "date-time") {
          return {
            create: "DateTimeInput",
            list: "DateField",
            edit: "DateTimeInput",
            show: "DateField",
          };
        }
        return {
          create: "TextInput",
          list: "TextField",
          edit: "TextInput",
          show: "TextField",
        };
      case "boolean":
        return {
          create: "BooleanInput",
          list: "BooleanField",
          edit: "BooleanInput",
          show: "BooleanField",
        };
      case "number":
      case "integer":
        return {
          create: "NumberInput",
          list: "NumberField",
          edit: "NumberInput",
          show: "NumberField",
        };
      case "array":
        if (property.items) {
          if (property.items.type === "string" && property.items.enum) {
            return {
              create: "CheckboxGroupInput",
              list: "TextField",
              edit: "CheckboxGroupInput",
              show: "TextField",
              choices: property.items.enum.map((value) => ({ id: value, name: value })),
            };
          }
          return {
            create: "ArrayInput",
            list: "TextField",
            edit: "ArrayInput",
            show: "TextField",
            choices: "<SimpleFormIterator><TextInput /></SimpleFormIterator>",
          };
        }
        break;
      case "object":
        return {
          create: "NestedObjectSection",
          list: null,
          edit: "NestedObjectSection",
          show: "NestedObjectSection",
        };
      default:
        return {
          create: "TextInput",
          list: "TextField",
          edit: "TextInput",
          show: "TextField",
        };
    }
  };