export const usePanelProfileFormStore = defineStore(
  'panelProfileFormStore',
  () => {
    const inputFormDefault = {
      name: null as string | null,
      username: null as string | null,
      email: null as string | null,
      picture: null as string | null,
      file_picture: null as File | null,
    };
    const inputForm = reactive($objectClone(inputFormDefault));

    const onResetForm = () => {
      errorForm.value = null;
      itemProfile.value = null;
      $objectAssignTarget(inputForm, inputFormDefault);
    };

    const errorForm = ref<Record<string, any> | null>(null);
    const onValidateForm = () => {
      errorForm.value = $validateInput(inputForm, {
        name: ['is_not_empty'],
        username: ['is_not_empty'],
        email: inputForm.email ? ['is_email'] : [],
      });
      return $validateErrorMessage(errorForm.value);
    };

    const loadingSubmitForm = ref(false);
    const onSubmitForm = async () => {
      if (!onValidateForm()) return;
      if (loadingSubmitForm.value) return;

      loadingSubmitForm.value = true;

      const res: ApiResponse = await $axios().patch(
        '/profile',
        $createFormData(inputForm),
      );

      if (res.statusCode === 200) {
        $toast().open({
          type: 'success',
          message: $i18n().t('message.success_updated'),
        });

        $auth().fetchUser();
        navigateTo('/panel/profile');
      } else {
        $toast().open({
          type: 'error',
          message: $apiErrorMessage(res),
        });
      }

      loadingSubmitForm.value = false;
    };

    const itemProfile = ref<ItemUser | null>(null);
    const loadingItemProfile = ref(false);
    const onFetchItemProfile = async () => {
      loadingItemProfile.value = true;

      const res: ApiResponse = await $axios().get(`/profile`);

      if (res.statusCode === 200) {
        itemProfile.value = res.data;

        $objectAssignTarget(inputForm, res.data);
      } else {
        $toast().open({
          type: 'error',
          message: $apiErrorMessage(res),
        });
      }

      loadingItemProfile.value = false;
    };

    return {
      inputForm,
      errorForm,
      itemProfile,
      loadingItemProfile,
      loadingSubmitForm,
      onFetchItemProfile,
      onResetForm,
      onSubmitForm,
    };
  },
);
