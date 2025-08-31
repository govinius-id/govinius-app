export default defineEventHandler({
  onRequest: [authGuard],
  handler: async (event) => {
    return {
      statusCode: 200,
      data: await profileService.findOne(event),
    };
  },
});
