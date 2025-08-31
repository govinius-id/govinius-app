<template>
  <BaseCard bordered>
    <BaseCardHead bordered :title="$i18n().t('common.change_password')">
      <template #prefix>
        <BaseButtonIcon icon="ph:arrow-left" @click="$router.back()" />
      </template>
    </BaseCardHead>

    <div class="flex w-full flex-col gap-y-4 md:max-w-96">
      <BaseInputPassword
        v-model="panelChangePasswordFormStore.inputForm.old_password"
        :error="panelChangePasswordFormStore.errorForm?.old_password"
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
        v-model="panelChangePasswordFormStore.inputForm.new_password"
        :error="panelChangePasswordFormStore.errorForm?.new_password"
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
        :loading="panelChangePasswordFormStore.loadingSubmitForm"
        @click="panelChangePasswordFormStore.onSubmitForm()"
      >
        {{ $i18n().t('common.save') }}
      </BaseButton>
    </BaseCardAction>
  </BaseCard>
</template>

<script lang="ts" setup>
const panelChangePasswordFormStore = usePanelChangePasswordFormStore();

onMounted(() => {
  panelChangePasswordFormStore.onResetForm();
});
</script>
