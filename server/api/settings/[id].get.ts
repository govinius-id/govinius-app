export default defineEventHandler({
  onRequest: [authGuard],
  handler: async (event) => {
    $validateRolePermission(
      event,
      $userPermissionAny(event, ['SETTING_DETAIL', 'SETTING_UPDATE']),
    );

    const id = getRouterParam(event, 'id') as string;

    return {
      statusCode: 200,
      data: await settingsService.findOne(event, +id),
    };
  },
});
