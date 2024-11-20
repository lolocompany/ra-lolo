export const getComponentByType = (property, fieldName) => {
  if (fieldName.endsWith("Id")) {
    return {
      create: "ReferenceInput",
      list: "ReferenceField",
      edit: "ReferenceInput",
      show: "ReferenceField",
      choices: "SelectInput",
      filter: "ReferenceInput",
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
          filter: "SelectInput",
        };
      }
      if (property.format === "email") {
        return {
          create: "TextInput",
          list: "TextField",
          edit: "TextInput",
          show: "TextField",
          choices: { type: "email" },
          filter: "TextInput",
        };
      }
      if (property.format === "uri") {
        return {
          create: "TextInput",
          list: "TextField",
          edit: "TextInput",
          show: "TextField",
          choices: { type: "url" },
          filter: "TextInput",
        };
      }
      if (property.format === "date") {
        return {
          create: "DateInput",
          list: "DateField",
          edit: "DateInput",
          show: "DateField",
          filter: "DateInput",
        };
      }
      if (property.format === "date-time") {
        return {
          create: "DateTimeInput",
          list: "DateField",
          edit: "DateTimeInput",
          show: "DateField",
          filter: "DateTimeInput",
        };
      }
      return {
        create: "TextInput",
        list: "TextField",
        edit: "TextInput",
        show: "TextField",
        filter: "TextInput",
      };
    case "boolean":
      return {
        create: "BooleanInput",
        list: "BooleanField",
        edit: "BooleanInput",
        show: "BooleanField",
        filter: "BooleanInput",
      };
    case "number":
    case "integer":
      return {
        create: "NumberInput",
        list: "NumberField",
        edit: "NumberInput",
        show: "NumberField",
        filter: "NumberInput",
      };
    case "array":
      if (property.items) {
        if (property.items.type === "string" && property.items.enum) {
          return {
            create: "CheckboxGroupInput",
            list: "ChipField",
            edit: "CheckboxGroupInput",
            show: "ChipField",
            choices: property.items.enum.map((value) => ({
              id: value,
              name: value,
            })),
            filter: "CheckboxGroupInput",
          };
        }
        return {
          create: "ArrayObjectSimpleFormIterator",
          list: null,
          edit: "ArrayObjectSimpleFormIterator",
          show: null,
          filter: null,
          items: property.items,
        };
      }
      break;
    case "object":
      return {
        create: "NestedObjectSection",
        list: null,
        edit: "NestedObjectSection",
        show: "NestedObjectSection",
        filter: null,
      };
    default:
      return {
        create: "TextInput",
        list: "TextField",
        edit: "TextInput",
        show: "TextField",
        filter: "TextInput",
      };
  }
};
