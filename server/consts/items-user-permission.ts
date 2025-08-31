import type { H3Event } from 'h3';

export const constItemsUserPermission = (event: H3Event) => {
  return [
    {
      text: $i18n(event).t('common.user'),
      children: [
        ...$generateItemsPermission(event, {
          prefix: 'USER',
          actions: ['LIST', 'DETAIL', 'CREATE', 'UPDATE', 'DELETE'],
        }),
      ],
    },
    {
      text: $i18n(event).t('common.setting'),
      children: [
        ...$generateItemsPermission(event, {
          prefix: 'SETTING',
          actions: ['LIST', 'DETAIL', 'CREATE', 'UPDATE', 'DELETE'],
        }),
      ],
    },
  ];
};
