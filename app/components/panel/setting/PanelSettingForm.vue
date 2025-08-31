<template>
  <BaseModalCard
    v-model="panelSettingFormStore.isModalOpen"
    :title="
      panelSettingFormStore.isEditing()
        ? $i18n().t('common.edit_value', {
            value: $i18n().t('common.setting'),
          })
        : $i18n().t('common.add_value', {
            value: $i18n().t('common.setting'),
          })
    "
  >
    <template #content>
      <div class="flex flex-col gap-y-4">
        <BaseInput
          v-model="inputKeyModel"
          :error="panelSettingFormStore.errorForm?.key"
          :loading="panelSettingFormStore.loadingItemSetting"
          :label="$i18n().t('common.key')"
          :placeholder="
            $i18n().t('common.enter_value', {
              value: $i18n().t('common.key').toLowerCase(),
            })
          "
          label-required
          class="w-full"
          @keydown="keydownKey"
        />

        <BaseInput
          v-model="panelSettingFormStore.inputForm.value"
          :error="panelSettingFormStore.errorForm?.value"
          :loading="panelSettingFormStore.loadingItemSetting"
          :label="$i18n().t('common.value')"
          label-required
          class="w-full"
        />

        <BaseInputTextarea
          v-model="panelSettingFormStore.inputForm.description"
          :loading="panelSettingFormStore.loadingItemSetting"
          :label="$i18n().t('common.description')"
          label-optional
          class="w-full"
        />
      </div>
    </template>

    <template #action>
      <BaseButton
        color="primary"
        icon-prefix="ph:check-circle-duotone"
        :loading="panelSettingFormStore.loadingSubmitForm"
        @click="panelSettingFormStore.onSubmitForm()"
      >
        {{ $i18n().t('common.save') }}
      </BaseButton>
    </template>
  </BaseModalCard>
</template>

<script lang="ts" setup>
const panelSettingFormStore = usePanelSettingFormStore();

const inputKeyModel = computed({
  get() {
    return panelSettingFormStore.inputForm.key;
  },
  set(value: any) {
    panelSettingFormStore.inputForm.key = value
      ?.toUpperCase()
      ?.replaceAll(' ', '_');
  },
});

const keydownKey = (event: KeyboardEvent) => {
  const isAllowedKey =
    /^[a-zA-Z0-9_]$/.test(event.key) ||
    event.key === 'Backspace' ||
    event.key === 'Delete' ||
    event.key === 'ArrowLeft' ||
    event.key === 'ArrowRight' ||
    event.key === ' ' ||
    event.key === 'Tab' ||
    ((event.ctrlKey || event.metaKey) &&
      ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase()));

  if (!isAllowedKey) {
    event.preventDefault();
  }
};

onMounted(() => {
  panelSettingFormStore.onCloseModal();
});
</script>
