export const usePanelProfileDetailStore = defineStore(
  'panelProfileDetailStore',
  () => {
    const itemProfile = ref<ItemUser | null>(null);
    const loadingItemProfile = ref(false);
    const onFetchItemProfile = async () => {
      loadingItemProfile.value = true;

      const res: ApiResponse = await $axios().get(`/profile`);

      if (res.statusCode === 200) {
        itemProfile.value = res.data;
      } else {
        $toast().open({
          type: 'error',
          message: $apiErrorMessage(res),
        });
      }

      loadingItemProfile.value = false;
    };

    return {
      itemProfile,
      loadingItemProfile,
      onFetchItemProfile,
    };
  },
);
