export const pathConverterFromSlashToList = (
  pathList: [string, ...string[]]
): string => {
  let pathWithSlash = "";
  pathList.map((one: string) => (pathWithSlash = pathWithSlash + "/" + one));
  return pathWithSlash;
};
