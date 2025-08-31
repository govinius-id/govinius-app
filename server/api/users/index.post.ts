export default defineEventHandler({
  onRequest: [authGuard],
  handler: async (event) => {
    $validateRolePermission(
      event,
      $userPermissionMatch(event, ['USER_CREATE']),
    );

    const payload = await $readFormData(event);

    const errorForm = $validateInput(event, payload, {
      name: ['is_not_empty'],
      email: ['is_not_empty', 'is_email'],
      password: ['is_not_empty'],
      role: ['is_not_empty'],
    });

    $validateErrorMessage(event, errorForm);

    return {
      statusCode: 201,
      data: await usersService.create(event, payload),
    };
  },
});
