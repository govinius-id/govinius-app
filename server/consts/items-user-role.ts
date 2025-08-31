import type { H3Event } from 'h3';

export const constItemsUserRole = (event: H3Event) => {
  return [
    {
      text: $i18n(event).t('user_role.admin'),
      value: 'ADMIN',
    },
  ];
};
