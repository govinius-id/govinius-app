export default defineEventHandler({
  onRequest: [authGuard],
  handler: async (event) => {
    $validateRolePermission(event, $userRoleMatch(event, ['ADMIN']));

    const payload = await readBody(event);

    const errorForm = $validateInput(event, payload, {
      permissions: ['is_not_empty'],
      role: ['is_not_empty'],
    });

    $validateErrorMessage(event, errorForm);

    return {
      statusCode: 200,
      data: await rolePermissionsService.createOrUpdate(event, payload),
    };
  },
});
