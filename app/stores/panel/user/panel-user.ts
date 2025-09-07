export const usePanelUserStore = defineStore('panelUserStore', () => {
  // Form
  const isEditing = () => {
    return $isNotEmpty(useRoute().params.user_id);
  };

  const { inputForm, errorForm, onResetForm, onValidateForm } = useFormState({
    state: {
      name: null as string | null,
      username: null as string | null,
      email: null as string | null,
      password: null as string | null,
      role: null as string | null,
      role_detail: null as ItemUserRole | null,
      is_active: true,
      picture: null as string | null,
      file_picture: null as File | null,
    },
    onReset: () => {
      itemUser.value = null;
    },
    onValidate: () => {
      errorForm.value = $validateInput(inputForm, {
        name: ['is_not_empty'],
        username: ['is_not_empty'],
        email: inputForm.email ? ['is_email'] : [],
        password: !isEditing() ? ['is_not_empty'] : [],
        role: ['is_not_empty'],
      });
    },
  });

  const { loadingSubmit: loadingSubmitForm, onSubmit: onSubmitForm } =
    useSubmitState({
      onBeforeSubmit: async () => {
        return onValidateForm();
      },
      onSubmit: () => {
        if (isEditing()) {
          return $axios().put(
            `/users/${useRoute().params.user_id}`,
            $createFormData(inputForm),
          );
        } else {
          return $axios().post('/users', $createFormData(inputForm));
        }
      },
      onSuccess: (res) => {
        $toast().open({
          type: 'success',
          message: $i18n().t('message.success_saved'),
        });
        if (res.statusCode === 200) {
          onFetchItemUser();
        } else if (res.statusCode === 201) {
          navigateTo('/panel/user');
        }
      },
    });
  //

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

  // List
  const {
    itemsList: itemsUser,
    loadingItemsList: loadingItemsUser,
    total: totalUser,
    onFetchItemsList: onFetchItemsUser,
  } = useFetchListState({
    state: [] as ItemUser[],
    onFetch: async () => {
      return $axios().get('/users', {
        params: {
          ...inputSearch,
          ...inputPagination,
          ...$objectOmitKeys(inputFilter, [
            'active_status_detail',
            'role_detail',
          ]),
        },
      });
    },
    onSuccess: (res) => {
      itemsUser.value = res.data.rows;
      totalUser.value = res.data.count;
    },
  });
  //

  // Detail
  const {
    itemDetail: itemUser,
    loadingItemDetail: loadingItemUser,
    onFetchItemDetail: onFetchItemUser,
  } = useFetchDetailState({
    state: null as ItemUser | null,
    onFetch: () => {
      return $axios().get(`/users/${useRoute().params.user_id}`);
    },
    onSuccess: (res) => {
      itemUser.value = res.data;
    },
  });
  //

  // Delete
  const { onDeleteItem: onDeleteItemUser } = useDeleteItemState({
    onDelete: async (obj: ItemUser) => {
      return $axios().delete(`/users/${obj.id}`);
    },
    onSuccess: () => {
      if (useRoute().path === '/panel/user') {
        onFetchItemsUser({
          loading: false,
        });
      } else {
        navigateTo('/panel/user', { replace: true });
      }
    },
  });
  //

  return {
    isModalOpenFilter,
    inputSearch,
    inputPagination,
    inputFilter,
    inputFilterPreview,
    inputForm,
    itemsUser,
    itemUser,
    totalUser,
    errorForm,
    loadingItemsUser,
    loadingItemUser,
    loadingSubmitForm,
    onResetSearch,
    onResetPagination,
    onResetFilter,
    onResetForm,
    onApplyFilter,
    onFetchItemsUser,
    onFetchItemUser,
    onDeleteItemUser,
    onSubmitForm,
    getRowNumber,
    isEditing,
  };
});
