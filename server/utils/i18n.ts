import type { H3Event } from 'h3';
import i18next from 'i18next';
import id from '@@/lang/id.json';

const langDefault = 'id';

export const $i18n = (event: H3Event) => {
  i18next.init({
    lng: $lang(event),
    fallbackLng: langDefault,
    interpolation: {
      prefix: '{',
      suffix: '}',
      escapeValue: false,
    },
    resources: {
      id: {
        translation: id,
      },
    },
  });
  return i18next;
};

export const $lang = (event: H3Event) => {
  const lang = getRequestHeader(event, 'Accept-Language');
  if (!lang) return langDefault;
  const langCode = lang.split('').slice(0, 2).join('');
  return langCode;
};
