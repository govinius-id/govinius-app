export default defineEventHandler({
  onRequest: [authGuard],
  handler: async (event) => {
    $validateRolePermission(
      event,
      $userPermissionAny(event, ['USER_DETAIL', 'USER_UPDATE']),
    );

    const id = getRouterParam(event, 'id') as string;

    return {
      statusCode: 200,
      data: await usersService.findOne(event, +id),
    };
  },
});
