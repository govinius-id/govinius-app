export const useAuthEmailVerificationStore = defineStore(
  'authEmailVerificationStore',
  () => {
    const getEmail = () => {
      const route = useRoute();
      return route.query.email as string;
    };

    const getToken = () => {
      const route = useRoute();
      return route.query.token as string;
    };

    const inputFormDefault = {
      email: null as string | null,
      token: null as string | null,
    };
    const inputForm = reactive($objectClone(inputFormDefault));

    const onResetForm = () => {
      errorForm.value = null;
      $objectAssignTarget(inputForm, inputFormDefault);
    };

    const errorForm = ref<Record<string, any> | null>(null);

    const onValidateForm = () => {
      errorForm.value = $validateInput(inputForm, {
        email: ['is_not_empty', 'is_email'],
        token: ['is_not_empty'],
      });
      return $validateErrorMessage(errorForm.value);
    };

    const loadingSubmitForm = ref(false);
    const onSubmitForm = async () => {
      inputForm.email = getEmail();
      inputForm.token = getToken();

      if (!onValidateForm()) return;
      if (loadingSubmitForm.value) return;

      loadingSubmitForm.value = true;
      const res: ApiResponse = await $axios().patch(
        '/auth/email-verification',
        inputForm,
      );

      if (res.statusCode === 200) {
        $dialog().open({
          title: $i18n().t('common.success'),
          message: $i18n().t('auth.email_verification.success_verification', {
            email: inputForm.email,
          }),
          icon: 'ph:seal-check-fill',
          classes: {
            icon: 'size-10 text-success dark:text-success-700',
          },
          onOk: () => {
            navigateTo('/panel', { replace: true });
          },
        });
      } else {
        $toast().open({
          type: 'error',
          message: $apiErrorMessage(res),
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
      getEmail,
      getToken,
    };
  },
);
