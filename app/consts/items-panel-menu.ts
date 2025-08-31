export const constItemsPanelMainMenu = () => {
  const itemsMenu = [
    {
      text: $i18n().t('common.dashboard'),
      to: '/panel/dashboard',
      icon: 'ph:house-duotone',
      active: $isActiveRoute('/panel/dashboard'),
      roles: [],
      permissions: [],
    },
  ] as BaseMenuItem[];

  return itemsMenu?.filter((obj) => {
    return $userRoleAny(obj.roles) && $userPermissionAny(obj.permissions);
  });
};

export const constItemsPanelOtherMenu = () => {
  const itemsMenu = [
    {
      text: $i18n().t('common.user'),
      to: '/panel/user',
      icon: 'ph:users-duotone',
      active: $isActiveRoute('/panel/user'),
      roles: [],
      permissions: ['USER_LIST'],
    },
    {
      text: $i18n().t('common.role_permission'),
      to: '/panel/role-permission',
      icon: 'ph:key-duotone',
      active: $isActiveRoute('/panel/role-permission'),
      roles: ['ADMIN'],
      permissions: [],
    },
    {
      text: $i18n().t('common.setting'),
      to: '/panel/setting',
      icon: 'ph:gear-duotone',
      active: $isActiveRoute('/panel/setting'),
      roles: [],
      permissions: ['USER_LIST'],
    },
  ] as BaseMenuItem[];

  return itemsMenu?.filter((obj) => {
    return $userRoleAny(obj.roles) && $userPermissionAny(obj.permissions);
  });
};

export const constItemsPanelMasterMenu = () => {
  const itemsMenu = [] as BaseMenuItem[];

  return itemsMenu?.filter((obj) => {
    return $userRoleAny(obj.roles) && $userPermissionAny(obj.permissions);
  });
};
