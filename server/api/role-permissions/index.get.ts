export default defineEventHandler({
  onRequest: [authGuard],
  handler: async (event) => {
    $validateRolePermission(event, $userRoleMatch(event, ['ADMIN']));

    const payload = getQuery(event);

    return {
      statusCode: 200,
      data: await rolePermissionsService.findByRole(event, payload),
    };
  },
});
