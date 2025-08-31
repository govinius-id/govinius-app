export const usePanelUserDetailStore = defineStore(
  'panelUserDetailStore',
  () => {
    const getUserId = () => {
      const route = useRoute();
      const userId = route.params.user_id as string;
      return userId ? +userId : null;
    };

    const itemUser = ref<ItemUser | null>(null);
    const loadingItemUser = ref(false);
    const onFetchItemUser = async (options?: ApiFetchOption) => {
      const force = options?.force ?? true;
      const loading = options?.loading ?? true;

      if ($isNotEmptyObject(itemUser.value) && !force) {
        return;
      }

      loadingItemUser.value = loading;

      const res: ApiResponse = await $axios().get(`/users/${getUserId()}`);

      if (res.statusCode === 200) {
        itemUser.value = res.data;
      } else {
        $toast().open({
          type: 'error',
          message: $apiErrorMessage(res),
        });
      }

      loadingItemUser.value = false;
    };

    return {
      itemUser,
      loadingItemUser,
      onFetchItemUser,
      getUserId,
    };
  },
);
