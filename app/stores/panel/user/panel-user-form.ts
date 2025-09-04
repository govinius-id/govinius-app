export const usePanelUserFormStore = defineStore('panelUserFormStore', () => {
  const panelUserDetailStore = usePanelUserDetailStore();

  const isEditing = () => {
    return $isNotEmpty(panelUserDetailStore.getUserId());
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

  const loadingSubmitForm = ref(false);
  const onSubmitForm = async () => {
    if (!onValidateForm()) return;
    if (loadingSubmitForm.value) return;

    loadingSubmitForm.value = true;

    let res: ApiResponse;
    if (isEditing()) {
      res = await $axios().put(
        `/users/${panelUserDetailStore.getUserId()}`,
        $createFormData(inputForm),
      );
    } else {
      res = await $axios().post('/users', $createFormData(inputForm));
    }

    if (res.statusCode === 200) {
      $toast().open({
        type: 'success',
        message: $i18n().t('message.success_updated'),
      });
      onFetchItemUser();
    } else if (res.statusCode === 201) {
      $toast().open({
        type: 'success',
        message: $i18n().t('message.success_added'),
      });
      navigateTo('/panel/user');
    } else {
      $toast().open({
        type: 'error',
        message: $apiErrorMessage(res),
      });
    }

    loadingSubmitForm.value = false;
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

    const res: ApiResponse = await $axios().get(
      `/users/${panelUserDetailStore.getUserId()}`,
    );

    if (res.statusCode === 200) {
      itemUser.value = res.data;

      $objectAssignTarget(inputForm, res.data);
    } else {
      $toast().open({
        type: 'error',
        message: $apiErrorMessage(res),
      });
    }

    loadingItemUser.value = false;
  };

  return {
    inputForm,
    errorForm,
    itemUser,
    loadingSubmitForm,
    loadingItemUser,
    isEditing,
    onResetForm,
    onSubmitForm,
    onFetchItemUser,
  };
});
