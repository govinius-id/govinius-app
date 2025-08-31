export default defineEventHandler({
  onRequest: [authGuard],
  handler: (event) => {
    return {
      statusCode: 200,
      data: event.context.user,
    };
  },
});
