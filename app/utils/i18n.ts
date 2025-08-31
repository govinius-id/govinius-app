import i18next from 'i18next';
import id from '@@/lang/id.json';

const langDefault = 'id';

export const $i18n = () => {
  i18next.init({
    lng: $lang(),
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

export const $lang = () => {
  const lang = useCookie('lang').value;
  if (!lang) return langDefault;
  return lang;
};

export const $changeLang = (value: string) => {
  const langCookie = useCookie('lang', {
    expires: $dayjs().tz().tz($timezone()).add(7, 'day').toDate(),
  });
  langCookie.value = value;
  window.location.reload();
};
