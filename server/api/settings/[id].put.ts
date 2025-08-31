export default defineEventHandler({
  onRequest: [authGuard],
  handler: async (event) => {
    $validateRolePermission(
      event,
      $userPermissionMatch(event, ['SETTING_UPDATE']),
    );

    const id = getRouterParam(event, 'id') as string;
    const payload = await readBody(event);

    const errorForm = $validateInput(event, payload, {
      key: ['is_not_empty'],
      value: ['is_not_empty'],
    });

    $validateErrorMessage(event, errorForm);

    return await $drizzle(event).transaction(async (tx) => {
      event.context.tx = tx;

      return {
        statusCode: 200,
        data: await settingsService.update(event, +id, payload),
      };
    });
  },
});
