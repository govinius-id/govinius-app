export default defineEventHandler({
  onRequest: [authGuard],
  handler: async (event) => {
    $validateRolePermission(
      event,
      $userPermissionMatch(event, ['SETTING_DELETE']),
    );

    const id = getRouterParam(event, 'id') as string;

    return await $drizzle(event).transaction(async (tx) => {
      event.context.tx = tx;

      return {
        statusCode: 200,
        data: await settingsService.remove(event, +id),
      };
    });
  },
});
