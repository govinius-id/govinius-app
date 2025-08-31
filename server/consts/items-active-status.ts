import type { H3Event } from 'h3';

export const constItemsActiveStatus = (event: H3Event) => {
  return [
    {
      text: $i18n(event).t('common.active'),
      value: 'ACTIVE',
      color: '#28c76f',
    },
    {
      text: $i18n(event).t('common.inactive'),
      value: 'INACTIVE',
      color: '#f43f5e',
    },
  ];
};
