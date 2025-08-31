export default defineEventHandler({
  onRequest: [authGuard],
  handler: async (event) => {
    $validateRolePermission(
      event,
      $userPermissionMatch(event, ['SETTING_CREATE']),
    );

    const payload = await readBody(event);

    const errorForm = $validateInput(event, payload, {
      key: ['is_not_empty'],
      value: ['is_not_empty'],
    });

    $validateErrorMessage(event, errorForm);

    return await $drizzle(event).transaction(async (tx) => {
      event.context.tx = tx;

      return {
        statusCode: 201,
        data: await settingsService.create(event, payload),
      };
    });
  },
});
