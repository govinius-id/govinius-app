export default defineEventHandler({
  handler: async (event) => {
    const data = {
      items_user_role: constItemsUserRole(event),
      items_user_permission: constItemsUserPermission(event),
      items_active_status: constItemsActiveStatus(event),
    };

    return {
      statusCode: 200,
      data: data,
    };
  },
});
