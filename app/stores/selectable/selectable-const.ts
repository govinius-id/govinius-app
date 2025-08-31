export const useSelectableConstStore = defineStore(
  'selectableConstStore',
  () => {
    const itemConst = ref<ItemConst | null>(null);
    const loadingItemConst = ref(false);
    const onFetchItemConst = async () => {
      loadingItemConst.value = true;

      const res: ApiResponse = await $axios().get(`/consts`);

      if (res.statusCode === 200) {
        itemConst.value = res.data;
      } else {
        $toast().open({
          type: 'error',
          message: $apiErrorMessage(res),
        });
      }

      loadingItemConst.value = false;
    };

    return {
      itemConst,
      loadingItemConst,
      onFetchItemConst,
    };
  },
);
