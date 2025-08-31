export default defineEventHandler({
  onRequest: [authGuard],
  handler: async (event) => {
    $validateRolePermission(event, $userPermissionMatch(event, ['USER_LIST']));

    const payload = getQuery(event);

    return {
      statusCode: 200,
      data: await usersService.findAll(event, payload),
    };
  },
});
