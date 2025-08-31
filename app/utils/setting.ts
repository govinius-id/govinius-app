export const $setting = () => {
  const settingStore = useSettingStore();

  return {
    fetchSetting: settingStore.onFetchItemSetting,
    get: settingStore.getSettingValue,
  };
};
