export const $fileUploadExtension = (filePath: string) => {
  const parts = filePath.split('.');
  return parts.length > 1 ? parts.pop() : null;
};
