export default defineEventHandler({
  handler: (event) => {
    const payload = getQuery(event);

    return $fileUploadReadFromStorage({
      filePath: payload.file as string,
      storageToken: payload.token as string,
    });
  },
});
