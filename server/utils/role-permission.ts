import type { H3Event } from 'h3';

export const $userRoleMatch = (event: H3Event, roles?: string[]) => {
  if (!roles) return true;
  if (roles.length === 0) return true;
  const userRole = event.context.user?.role || null;
  if (!userRole) return false;
  return roles.every((value) => value === userRole);
};

export const $userRoleAny = (event: H3Event, roles?: string[]) => {
  if (!roles) return true;
  if (roles.length === 0) return true;
  const userRole = event.context.user?.role || null;
  if (!userRole) return false;
  return roles.includes(userRole);
};

export const $userPermissionMatch = (
  event: H3Event,
  permissions?: string[],
) => {
  if (!permissions) return true;
  if (permissions.length === 0) return true;
  const userPermissions = event.context.user?.permissions || [];
  return permissions.every((permission) =>
    userPermissions.includes(permission),
  );
};

export const $userPermissionAny = (event: H3Event, permissions?: string[]) => {
  if (!permissions) return true;
  if (permissions.length === 0) return true;
  const userPermissions = event.context.user?.permissions || [];
  return permissions.some((permission) => userPermissions.includes(permission));
};

export const $validateRolePermission = (event: H3Event, condition: boolean) => {
  if (!condition) {
    throw createError({
      statusCode: 404,
      message: $i18n(event).t('message.error_forbidden'),
    });
  }
};

export const $generateItemsPermission = (
  event: H3Event,
  opts: {
    prefix: string;
    actions: string[];
    textValue?: string;
  },
) => {
  return opts.actions.map((value) => {
    return {
      text: opts.textValue
        ? $i18n(event).t(`user_permission.${value.toLowerCase()}_value`, {
            value: opts.textValue,
          })
        : $i18n(event).t(`user_permission.${value.toLowerCase()}`),
      value: `${opts.prefix}_${value}`,
    };
  });
};
