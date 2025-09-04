export const usePanelUserListStore = defineStore('panelUserListStore', () => {
  // Search
  const { inputSearch, onResetSearch } = useSearchState({
    state: {
      search: null as string | null,
    },
    onChange: () => {
      onResetPagination();
      onFetchItemsUser();
    },
  });
  //

  // Pagination
  const { inputPagination, onResetPagination, getRowNumber } =
    usePaginationState({
      state: {
        page: 1,
        per_page: 10,
      },
      onChange: () => {
        document.getElementById('app-top')?.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
        onFetchItemsUser();
      },
    });
  //

  // Filter
  const {
    isModalOpenFilter,
    inputFilter,
    inputFilterPreview,
    onResetFilter,
    onApplyFilter,
  } = useFilterState({
    state: {
      role: null as string | null,
      role_detail: null as ItemUserRole | null,
      active_status: null as string | null,
      active_status_detail: null as ItemActiveStatus | null,
    },
    onApply: () => {
      onResetPagination();
      onFetchItemsUser();
    },
  });
  //

  const itemsUser = ref<ItemUser[]>([]);
  const totalUser = ref(0);
  const loadingItemsUser = ref(true);
  const onFetchItemsUser = async (options?: ApiFetchOption) => {
    const force = options?.force ?? true;
    const loading = options?.loading ?? true;

    if (itemsUser.value.length > 0 && !force) {
      return;
    }

    loadingItemsUser.value = loading;

    const res: ApiResponse = await $axios().get('/users', {
      params: {
        ...inputSearch,
        ...inputPagination,
        ...$objectOmitKeys(inputFilter, [
          'active_status_detail',
          'role_detail',
        ]),
      },
    });

    if (res.statusCode === 200) {
      itemsUser.value = res.data.rows;
      totalUser.value = res.data.count;
    } else {
      $toast().open({
        type: 'error',
        message: $apiErrorMessage(res),
      });
    }

    loadingItemsUser.value = false;
  };

  const onDeleteItemUser = (obj: ItemUser) => {
    $dialog().open({
      type: 'confirm',
      title: $i18n().t('common.delete'),
      message: $i18n().t('message.before_delete'),
      icon: 'ph:trash',
      textOk: $i18n().t('common.delete'),
      colorOk: 'danger',
      classes: {
        icon: 'size-10 text-danger',
      },
      onOk: async () => {
        const res: ApiResponse = await $axios().delete(`/users/${obj.id}`);

        if (res.statusCode === 200) {
          $dialog().close();
          $toast().open({
            type: 'success',
            message: $i18n().t('message.success_deleted'),
          });
          if (useRoute().path === '/panel/user') {
            onFetchItemsUser({
              loading: false,
            });
          } else {
            navigateTo('/panel/user', { replace: true });
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
    isModalOpenFilter,
    inputSearch,
    inputPagination,
    inputFilter,
    inputFilterPreview,
    itemsUser,
    totalUser,
    loadingItemsUser,
    onResetSearch,
    onResetPagination,
    onResetFilter,
    onApplyFilter,
    onFetchItemsUser,
    onDeleteItemUser,
    getRowNumber,
  };
});
