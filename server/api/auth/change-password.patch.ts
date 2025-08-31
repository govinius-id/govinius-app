export default defineEventHandler({
  onRequest: [authGuard],
  handler: async (event) => {
    const payload = await readBody(event);

    const errorForm = $validateInput(event, payload, {
      old_password: ['is_not_empty'],
      new_password: ['is_not_empty'],
    });

    $validateErrorMessage(event, errorForm);

    return {
      statusCode: 200,
      data: await authPasswordService.changePassword(event, payload),
    };
  },
});
