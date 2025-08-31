export const usePanelSettingListStore = defineStore(
  'panelSettingListStore',
  () => {
    // Search
    const inputSearchDefault = {
      search: null as string | null,
    };
    const inputSearch = reactive($objectClone(inputSearchDefault));

    const onResetSearch = () => {
      $objectAssignTarget(inputSearch, inputSearchDefault);
    };

    const timeoutSearch = ref();
    watch(
      () => inputSearch,
      () => {
        clearTimeout(timeoutSearch.value);
        timeoutSearch.value = setTimeout(() => {
          onResetPagination();
          onFetchItemsSetting();
        }, 500);
      },
      { deep: true },
    );
    //

    // Pagination
    const inputPaginationDefault = {
      page: 1,
      per_page: 10,
    };
    const inputPagination = reactive($objectClone(inputPaginationDefault));

    const onResetPagination = () => {
      $objectAssignTarget(inputPagination, inputPaginationDefault);
    };

    watch(
      () => inputPagination,
      () => {
        $scrollIntoElement('app-top');
        onFetchItemsSetting();
      },
      { deep: true },
    );

    const getRowNumber = (index: number) => {
      return (inputPagination.page - 1) * inputPagination.per_page + index + 1;
    };
    //

    const itemsSetting = ref<ItemSetting[]>([]);
    const totalSetting = ref(0);
    const loadingItemsSetting = ref(true);
    const onFetchItemsSetting = async (options?: ApiFetchOption) => {
      const force = options?.force ?? true;
      const loading = options?.loading ?? true;

      if (itemsSetting.value.length > 0 && !force) {
        return;
      }

      loadingItemsSetting.value = loading;

      const res: ApiResponse = await $axios().get('/settings', {
        params: {
          ...inputSearch,
          ...inputPagination,
        },
      });

      if (res.statusCode === 200) {
        itemsSetting.value = res.data.rows;
        totalSetting.value = res.data.count;
      } else {
        $toast().open({
          type: 'error',
          message: $apiErrorMessage(res),
        });
      }

      loadingItemsSetting.value = false;
    };

    const onDeleteItemSetting = (obj: ItemSetting) => {
      $dialog().open({
        type: 'confirm',
        title: $i18n().t('common.delete'),
        message: $i18n().t('message.before_delete'),
        icon: 'ph:trash',
        textOk: $i18n().t('common.delete'),
        colorOk: 'danger',
        classes: {
          icon: 'size-10 text-danger dark:text-danger-700',
        },
        onOk: async () => {
          const res: ApiResponse = await $axios().delete(`/settings/${obj.id}`);

          if (res.statusCode === 200) {
            $dialog().close();
            $toast().open({
              type: 'success',
              message: $i18n().t('message.success_deleted'),
            });
            if (useRoute().path === '/panel/setting') {
              onFetchItemsSetting({
                loading: false,
              });
            } else {
              navigateTo('/panel/setting', { replace: true });
            }
          } else {
            $toast().open({
              type: 'error',
              message: $apiErrorMessage(res),
            });
          }
        },
      });
    };

    return {
      inputSearch,
      inputPagination,
      itemsSetting,
      totalSetting,
      loadingItemsSetting,
      onResetSearch,
      onResetPagination,
      onFetchItemsSetting,
      onDeleteItemSetting,
      getRowNumber,
    };
  },
);
