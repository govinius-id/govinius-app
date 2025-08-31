export default defineEventHandler({
  handler: async (event) => {
    const payload = await readBody(event);

    const errorForm = $validateInput(event, payload, {
      email: ['is_not_empty', 'is_email'],
      token: ['is_not_empty'],
    });

    $validateErrorMessage(event, errorForm);

    return {
      statusCode: 200,
      data: await authEmailService.emailVerification(event, payload),
    };
  },
});
