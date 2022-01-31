export const pathConverterFromSlashToList = (
  pathWithSlash: string
): string[] => {
  return pathWithSlash.split("/");
};
