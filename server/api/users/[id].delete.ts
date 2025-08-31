export default defineEventHandler({
  onRequest: [authGuard],
  handler: async (event) => {
    $validateRolePermission(
      event,
      $userPermissionMatch(event, ['USER_DELETE']),
    );

    const id = getRouterParam(event, 'id') as string;

    return {
      statusCode: 200,
      data: await usersService.remove(event, +id),
    };
  },
});
