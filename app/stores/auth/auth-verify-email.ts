export const useAuthVerifyEmailStore = defineStore(
  'authVerifyEmailStore',
  () => {
    const inputFormDefault = {
      email: null as string | null,
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
      });
      return $validateErrorMessage(errorForm.value);
    };

    const loadingSubmitForm = ref(false);
    const onSubmitForm = async () => {
      if (loadingSubmitForm.value) return;

      loadingSubmitForm.value = true;
      const res: ApiResponse = await $axios().patch(
        '/auth/email-verification-email',
        {
          email: inputForm.email || $auth().user?.email,
        },
      );

      if (res.statusCode === 200) {
        $dialog().open({
          title: $i18n().t('common.email_sent'),
          message: $i18n().t('auth.verify_email.success_send_email', {
            email: inputForm.email || $auth().user?.email,
          }),
          icon: 'ph:envelope-simple-open-fill',
          classes: {
            icon: 'size-10 text-info dark:text-info-700',
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
    };
  },
);
