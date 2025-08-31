export const usePanelChangePasswordFormStore = defineStore(
  'panelChangePasswordFormStore',
  () => {
    const inputFormDefault = {
      old_password: null as string | null,
      new_password: null as string | null,
    };
    const inputForm = reactive($objectClone(inputFormDefault));

    const onResetForm = () => {
      errorForm.value = null;
      $objectAssignTarget(inputForm, inputFormDefault);
    };

    const errorForm = ref<Record<string, any> | null>(null);
    const onValidateForm = () => {
      errorForm.value = $validateInput(inputForm, {
        old_password: ['is_not_empty'],
        new_password: ['is_not_empty'],
      });
      return $validateErrorMessage(errorForm.value);
    };

    const loadingSubmitForm = ref(false);
    const onSubmitForm = async () => {
      if (!onValidateForm()) return;
      if (loadingSubmitForm.value) return;

      loadingSubmitForm.value = true;

      const res: ApiResponse = await $axios().patch(
        '/auth/change-password',
        inputForm,
      );

      if (res.statusCode === 200) {
        await nextTick();

        $dialog().open({
          title: $i18n().t('common.success'),
          message: $i18n().t('auth.reset_password.success_change_password'),
          icon: 'ph:check-circle-fill',
          classes: {
            icon: 'size-10 text-success dark:text-success-700',
          },
          onOk: async () => {
            $dialog().close();
            await $auth().logout();
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
      onSubmitForm,
    };
  },
);
