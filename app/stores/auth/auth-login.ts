export const useAuthLoginStore = defineStore('authLoginStore', () => {
  const authTokenStore = useAuthTokenStore();

  const inputFormDefault = {
    username: null as string | null,
    password: null as string | null,
  };
  const inputForm = reactive($objectClone(inputFormDefault));

  const onResetForm = () => {
    errorForm.value = null;
    $objectAssignTarget(inputForm, inputFormDefault);
  };

  const errorForm = ref<Record<string, any> | null>(null);

  const onValidateForm = () => {
    errorForm.value = $validateInput(inputForm, {
      username: ['is_not_empty'],
      password: ['is_not_empty'],
    });
    return $validateErrorMessage(errorForm.value);
  };

  const loadingSubmitForm = ref(false);
  const onSubmitForm = async () => {
    if (!onValidateForm()) return;
    if (loadingSubmitForm.value) return;

    loadingSubmitForm.value = true;
    const res: ApiResponse = await $axios().post('/auth/login', inputForm);

    if (res.statusCode === 200) {
      authTokenStore.onStoreToken(res.data.access_token);
      nextTick(() => {
        window.location.href = '/panel/dashboard';
      });
    } else {
      $toast().open({
        type: 'error',
        message: $apiErrorMessage(
          res,
          $i18n().t('message.error_username_or_password'),
        ),
      });
    }

    loadingSubmitForm.value = false;
  };

  return {
    inputForm,
    errorForm,
    loadingSubmitForm,
    onResetForm,
    onValidateForm,
    onSubmitForm,
  };
});
