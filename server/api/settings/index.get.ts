export default defineEventHandler({
  onRequest: [authGuard],
  handler: async (event) => {
    $validateRolePermission(
      event,
      $userPermissionMatch(event, ['SETTING_LIST']),
    );

    const payload = getQuery(event);

    return {
      statusCode: 200,
      data: await settingsService.findAll(event, payload),
    };
  },
});
