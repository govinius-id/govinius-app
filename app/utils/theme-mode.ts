type ThemeModeValue = 'dark' | 'light';

export const $themeMode = (): ThemeModeValue => {
  const themeModeCookie = useCookie('theme_mode');

  if (!themeModeCookie.value) {
    themeModeCookie.value = 'light';
  }

  return themeModeCookie.value as ThemeModeValue;
};

export const $changeThemeMode = (value: ThemeModeValue) => {
  const themeModeCookie = useCookie('theme_mode', {
    expires: $dayjs().tz().tz($timezone()).add(7, 'day').toDate(),
  });

  themeModeCookie.value = value;

  const isDark = themeModeCookie.value === 'dark';

  if (import.meta.client) {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  if (import.meta.server) {
    useHead({
      htmlAttrs: {
        class: isDark ? 'dark' : '',
      },
    });
  }
};
