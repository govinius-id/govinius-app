import type { H3Event } from 'h3';

export const constItemsGender = (event: H3Event) => {
  return [
    {
      text: $i18n(event).t('gender.male'),
      value: 'M',
    },
    {
      text: $i18n(event).t('gender.female'),
      value: 'F',
    },
  ];
};
