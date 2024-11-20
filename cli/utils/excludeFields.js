export const EXCLUDE_FIELDS = {
    create: ["createdAt", "updatedAt", "createdBy", "updatedBy", "id"],
    list: ["createdAt", "updatedAt", "createdBy", "updatedBy", "id"],
    edit: ["createdAt", "updatedAt", "createdBy", "updatedBy", "id"],
    show: ["createdBy", "updatedBy"],
    filter: []
  };