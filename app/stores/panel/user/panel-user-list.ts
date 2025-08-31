export const usePanelUserListStore = defineStore('panelUserListStore', () => {
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
        onFetchItemsUser();
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
      document.getElementById('app-top')?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
      onFetchItemsUser();
    },
    { deep: true },
  );

  const getRowNumber = (index: number) => {
    return (inputPagination.page - 1) * inputPagination.per_page + index + 1;
  };
  //

  // Filter
  const isModalOpenFilter = ref(false);

  const inputFilterDefault = {
    role: null as string | null,
    role_detail: null as ItemUserRole | null,
    active_status: null as string | null,
    active_status_detail: null as ItemActiveStatus | null,
  };
  const inputFilter = reactive($objectClone(inputFilterDefault));
  const inputFilterPreview = ref($objectClone(inputFilterDefault));

  const onResetFilter = () => {
    $objectAssignNullable(inputFilter);
    onApplyFilter();
  };

  const onApplyFilter = () => {
    $objectAssignTarget(inputFilterPreview.value, inputFilter);
    onResetPagination();
    onFetchItemsUser();
    isModalOpenFilter.value = false;
  };
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
