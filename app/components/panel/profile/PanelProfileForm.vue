<template>
  <BaseCard bordered>
    <BaseCardHead
      bordered
      :title="
        $i18n().t('common.edit_value', { value: $i18n().t('common.profile') })
      "
    >
      <template #prefix>
        <BaseButtonIcon icon="ph:arrow-left" @click="$router.back()" />
      </template>
      <template #suffix>
        <BaseTooltip :text="$i18n().t('common.refresh')" position="bottom">
          <BaseButtonIcon
            icon="ph:arrow-clockwise"
            :loading="panelProfileFormStore.loadingItemProfile"
            @click="panelProfileFormStore.onFetchItemProfile()"
          />
        </BaseTooltip>
      </template>
    </BaseCardHead>

    <div class="flex w-full flex-col gap-y-4 md:max-w-96">
      <BaseInputImage
        v-model="panelProfileFormStore.inputForm.picture"
        v-model:file="panelProfileFormStore.inputForm.file_picture"
        :label="$i18n().t('common.profile_picture')"
        :preview="panelProfileFormStore.itemProfile?.picture_url"
        :allow-extensions="['jpg', 'jpeg', 'png', 'webp']"
        max-size="10MB"
        min-size="1KB"
      >
        <template #image="opts">
          <BaseInputImageCropperHeadless
            v-model="panelProfileFormStore.inputForm.file_picture"
            :label="$i18n().t('common.profile_picture')"
            @on-remove="opts.onRemove"
          >
            <BaseImageAvatar :src="opts.src" size="4xl" />
          </BaseInputImageCropperHeadless>
        </template>
      </BaseInputImage>

      <BaseInput
        v-model="panelProfileFormStore.inputForm.name"
        :error="panelProfileFormStore.errorForm?.name"
        :loading="panelProfileFormStore.loadingItemProfile"
        :label="$i18n().t('common.name')"
        :placeholder="
          $i18n().t('common.enter_value', {
            value: $i18n().t('common.name').toLowerCase(),
          })
        "
        label-required
        class="w-full"
      />

      <BaseInput
        v-model="panelProfileFormStore.inputForm.username"
        :error="panelProfileFormStore.errorForm?.username"
        :loading="panelProfileFormStore.loadingItemProfile"
        :label="$i18n().t('common.username')"
        :placeholder="
          $i18n().t('common.enter_value', {
            value: $i18n().t('common.username').toLowerCase(),
          })
        "
        label-required
        class="w-full"
      />

      <BaseInput
        v-model="panelProfileFormStore.inputForm.email"
        :error="panelProfileFormStore.errorForm?.email"
        :loading="panelProfileFormStore.loadingItemProfile"
        :label="$i18n().t('common.email')"
        :placeholder="
          $i18n().t('common.enter_value', {
            value: $i18n().t('common.email').toLowerCase(),
          })
        "
        class="w-full"
        clearable
        @clear="panelProfileFormStore.inputForm.email = null"
      />
    </div>

    <BaseCardAction>
      <BaseButton
        icon-prefix="ph:check-circle-duotone"
        color="primary"
        :loading="panelProfileFormStore.loadingSubmitForm"
        @click="panelProfileFormStore.onSubmitForm()"
      >
        {{ $i18n().t('common.save') }}
      </BaseButton>
    </BaseCardAction>
  </BaseCard>
</template>

<script lang="ts" setup>
const panelProfileFormStore = usePanelProfileFormStore();

onMounted(() => {
  panelProfileFormStore.onResetForm();
  panelProfileFormStore.onFetchItemProfile();
});
</script>
