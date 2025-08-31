export default defineEventHandler({
  handler: async (event) => {
    const payload = await readBody(event);

    const errorForm = $validateInput(event, payload, {
      email: ['is_not_empty', 'is_email'],
    });

    $validateErrorMessage(event, errorForm);

    return {
      statusCode: 200,
      data: await authPasswordService.resetPasswordEmail(event, payload),
    };
  },
});
