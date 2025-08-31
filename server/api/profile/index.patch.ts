export default defineEventHandler({
  onRequest: [authGuard],
  handler: async (event) => {
    const payload = await $readFormData(event);

    const errorForm = $validateInput(event, payload, {
      name: ['is_not_empty'],
      email: payload.email ? ['is_email'] : [],
    });

    $validateErrorMessage(event, errorForm);

    return {
      statusCode: 200,
      data: await profileService.update(event, payload),
    };
  },
});
