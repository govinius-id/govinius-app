export default defineEventHandler({
  handler: async (event) => {
    return {
      statusCode: 200,
      data: await authService.refresh(event),
    };
  },
});
