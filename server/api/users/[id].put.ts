export default defineEventHandler({
  onRequest: [authGuard],
  handler: async (event) => {
    $validateRolePermission(
      event,
      $userPermissionMatch(event, ['USER_UPDATE']),
    );

    const id = getRouterParam(event, 'id') as string;
    const payload = await $readFormData(event);

    const errorForm = $validateInput(event, payload, {
      name: ['is_not_empty'],
      username: ['is_not_empty'],
      email: payload.email ? ['is_email'] : [],
      role: ['is_not_empty'],
    });

    $validateErrorMessage(event, errorForm);

    return {
      statusCode: 200,
      data: await usersService.update(event, +id, payload),
    };
  },
});
