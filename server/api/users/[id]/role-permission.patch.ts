export default defineEventHandler({
  onRequest: [authGuard],
  handler: async (event) => {
    $validateRolePermission(
      event,
      $userPermissionMatch(event, ['USER_UPDATE']),
    );

    const id = getRouterParam(event, 'id') as string;
    const payload = await readBody(event);

    const errorForm = $validateInput(event, payload, {
      is_role_permission_custom: ['is_not_empty'],
    });

    $validateErrorMessage(event, errorForm);

    return {
      statusCode: 200,
      data: await usersService.rolePermission(event, +id, payload),
    };
  },
});
