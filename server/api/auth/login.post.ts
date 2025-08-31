export default defineEventHandler({
  handler: async (event) => {
    const payload = await readBody(event);

    const errorForm = $validateInput(event, payload, {
      username: ['is_not_empty'],
      password: ['is_not_empty'],
    });

    $validateErrorMessage(event, errorForm);

    return {
      statusCode: 200,
      data: await authService.login(event, payload),
    };
  },
});
