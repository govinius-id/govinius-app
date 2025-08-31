export const $userRoleMatch = (roles?: string[]) => {
  if (!roles) return true;
  if (roles.length === 0) return true;
  const userRole = $auth().user?.role || null;
  if (!userRole) return false;
  return roles.every((value) => value === userRole);
};

export const $userRoleAny = (roles?: string[]) => {
  if (!roles) return true;
  if (roles.length === 0) return true;
  const userRole = $auth().user?.role || null;
  if (!userRole) return false;
  return roles.includes(userRole);
};

export const $userPermissionMatch = (permissions?: string[]) => {
  if (!permissions) return true;
  if (permissions.length === 0) return true;
  const userPermissions = $auth().user?.permissions || [];
  return permissions.every((permission) =>
    userPermissions.includes(permission),
  );
};

export const $userPermissionAny = (permissions?: string[]) => {
  if (!permissions) return true;
  if (permissions.length === 0) return true;
  const userPermissions = $auth().user?.permissions || [];
  return permissions.some((permission) => userPermissions.includes(permission));
};

export const $validateRolePermission = (condition: boolean) => {
  if (!condition) {
    const route = useRoute();

    throw createError({
      fatal: true,
      statusCode: 403,
      statusMessage: `Forbidden page: ${route.path}`,
    });
  }
};
