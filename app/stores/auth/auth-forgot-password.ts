export const useAuthForgotPasswordStore = defineStore(
  'authForgotPasswordStore',
  () => {
    const authVerifyEmailStore = useAuthVerifyEmailStore();

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
      if (!onValidateForm()) return;
      if (loadingSubmitForm.value) return;

      loadingSubmitForm.value = true;
      const res: ApiResponse = await $axios().patch(
        '/auth/reset-password-email',
        inputForm,
      );

      if (res.statusCode === 200) {
        $dialog().open({
          title: $i18n().t('common.email_sent'),
          message: $i18n().t('auth.forgot_password.success_send_email', {
            email: inputForm.email,
          }),
          icon: 'ph:envelope-simple-open-fill',
          classes: {
            icon: 'size-10 text-info dark:text-info-700',
          },
        });
      } else {
        if ($apiErrorMessage(res) === $i18n().t('common.email_unverified')) {
          $dialog().open({
            title: $i18n().t('common.email_unverified'),
            message: $i18n().t('auth.forgot_password.error_email_unverified'),
            icon: 'ph:seal-check-fill',
            textOk: $i18n().t('common.verify_now'),
            classes: {
              icon: 'size-10 text-slate-400',
            },
            onOk: () => {
              $dialog().close();
              setTimeout(() => {
                authVerifyEmailStore.inputForm.email = inputForm.email;
                authVerifyEmailStore.onSubmitForm();
              }, 500);
            },
          });
        } else {
          $toast().open({
            type: 'error',
            message: $apiErrorMessage(res),
          });
        }
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
