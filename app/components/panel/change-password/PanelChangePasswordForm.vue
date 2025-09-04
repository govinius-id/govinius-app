<template>
  <BaseCard bordered>
    <BaseCardHead bordered :title="$i18n().t('common.change_password')">
      <template #prefix>
        <BaseButtonIcon icon="ph:arrow-left" @click="$router.back()" />
      </template>
    </BaseCardHead>

    <div class="flex w-full flex-col gap-y-4 md:max-w-96">
      <BaseInputPassword
        v-model="inputForm.old_password"
        :error="errorForm?.old_password"
        :label="$i18n().t('common.old_password')"
        :placeholder="
          $i18n().t('common.enter_value', {
            value: $i18n().t('common.old_password').toLowerCase(),
          })
        "
        label-required
        class="w-full"
      />

      <BaseInputPassword
        v-model="inputForm.new_password"
        :error="errorForm?.new_password"
        :label="$i18n().t('common.new_password')"
        :placeholder="
          $i18n().t('common.enter_value', {
            value: $i18n().t('common.new_password').toLowerCase(),
          })
        "
        label-required
        class="w-full"
      />
    </div>

    <BaseCardAction>
      <BaseButton
        icon-prefix="ph:check-circle-duotone"
        color="primary"
        :loading="loadingSubmitForm"
        @click="onSubmitForm()"
      >
        {{ $i18n().t('common.save') }}
      </BaseButton>
    </BaseCardAction>
  </BaseCard>
</template>

<script lang="ts" setup>
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

onMounted(() => {
  onResetForm();
});
</script>
