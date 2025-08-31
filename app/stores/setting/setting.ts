export const useSettingStore = defineStore('settingStore', () => {
  const itemSetting = ref<Record<string, string>>({});
  const onFetchItemSetting = async () => {
    const res: ApiResponse = await $axios().get('/settings/key-value');

    if (res.statusCode === 200) {
      itemSetting.value = res.data;
    } else {
      $toast().open({
        type: 'error',
        message: $apiErrorMessage(res),
      });
    }
  };

  const getSettingValue = (key: string) => {
    return itemSetting.value?.[key] ?? null;
  };

  return {
    itemSetting,
    onFetchItemSetting,
    getSettingValue,
  };
});
