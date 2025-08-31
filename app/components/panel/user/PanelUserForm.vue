<template>
  <BaseCard bordered>
    <BaseCardHead
      :title="
        panelUserFormStore.isEditing()
          ? $i18n().t('common.edit_value', {
              value: $i18n().t('common.user'),
            })
          : $i18n().t('common.add_value', {
              value: $i18n().t('common.user'),
            })
      "
      bordered
    >
      <template #prefix>
        <BaseButtonIcon icon="ph:arrow-left" @click="$router.back()" />
      </template>
      <template #suffix>
        <BaseTooltip
          v-if="panelUserFormStore.isEditing()"
          :text="$i18n().t('common.refresh')"
          position="bottom"
        >
          <BaseButtonIcon
            icon="ph:arrow-clockwise"
            :loading="panelUserFormStore.loadingItemUser"
            @click="panelUserFormStore.onFetchItemUser()"
          />
        </BaseTooltip>
      </template>
    </BaseCardHead>

    <div class="flex w-full flex-col gap-y-4 md:max-w-96">
      <BaseInputImage
        v-model="panelUserFormStore.inputForm.picture"
        v-model:file="panelUserFormStore.inputForm.file_picture"
        :label="$i18n().t('common.profile_picture')"
        :preview="panelUserFormStore.itemUser?.picture_url"
        :loading="panelUserFormStore.loadingItemUser"
        :allow-extensions="['jpg', 'jpeg', 'png', 'webp']"
        max-size="10MB"
        min-size="1KB"
      >
        <template #image="opts">
          <BaseInputImageCropperHeadless
            v-model="panelUserFormStore.inputForm.file_picture"
            :label="$i18n().t('common.profile_picture')"
            @on-remove="opts.onRemove"
          >
            <BaseImageAvatar :src="opts.src" size="4xl" />
          </BaseInputImageCropperHeadless>
        </template>
      </BaseInputImage>

      <BaseInput
        v-model="panelUserFormStore.inputForm.name"
        :error="panelUserFormStore.errorForm?.name"
        :loading="panelUserFormStore.loadingItemUser"
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
        v-model="panelUserFormStore.inputForm.username"
        :error="panelUserFormStore.errorForm?.username"
        :loading="panelUserFormStore.loadingItemUser"
        :label="$i18n().t('common.username')"
        :placeholder="
          $i18n().t('common.enter_value', {
            value: $i18n().t('common.username').toLowerCase(),
          })
        "
        label-required
        class="w-full"
        @keydown="$keydownUsername"
        @input="$inputUsername"
      />

      <BaseInput
        v-model="panelUserFormStore.inputForm.email"
        :error="panelUserFormStore.errorForm?.email"
        :loading="panelUserFormStore.loadingItemUser"
        :label="$i18n().t('common.email')"
        :placeholder="
          $i18n().t('common.enter_value', {
            value: $i18n().t('common.email').toLowerCase(),
          })
        "
        class="w-full"
        inputmode="email"
      />

      <BaseInputPassword
        v-model="panelUserFormStore.inputForm.password"
        :error="panelUserFormStore.errorForm?.password"
        :loading="panelUserFormStore.loadingItemUser"
        :clearable="panelUserFormStore.isEditing()"
        :label="
          panelUserFormStore.isEditing()
            ? $i18n().t('common.new_password')
            : $i18n().t('common.password')
        "
        :placeholder="
          $i18n().t('common.enter_value', {
            value: panelUserFormStore.isEditing()
              ? $i18n().t('common.new_password').toLowerCase()
              : $i18n().t('common.password').toLowerCase(),
          })
        "
        :label-required="!panelUserFormStore.isEditing()"
        :label-optional="panelUserFormStore.isEditing()"
        class="w-full"
        @clear="panelUserFormStore.inputForm.password = null"
      />

      <SelectableUserRole
        v-model="panelUserFormStore.inputForm.role"
        v-model:item="panelUserFormStore.inputForm.role_detail"
        :error="panelUserFormStore.errorForm?.role"
        :loading="panelUserFormStore.loadingItemUser"
        :label="$i18n().t('common.role')"
        class="w-full"
        label-required
      />

      <BaseTextLabelContent :label="$i18n().t('common.active')">
        <BaseInputToggle v-model="panelUserFormStore.inputForm.is_active" />
      </BaseTextLabelContent>
    </div>

    <BaseCardAction>
      <BaseButton
        icon-prefix="ph:check-circle-duotone"
        color="primary"
        :loading="panelUserFormStore.loadingSubmitForm"
        @click="panelUserFormStore.onSubmitForm()"
      >
        {{ $i18n().t('common.save') }}
      </BaseButton>
    </BaseCardAction>
  </BaseCard>
</template>

<script lang="ts" setup>
const panelUserFormStore = usePanelUserFormStore();

onMounted(() => {
  panelUserFormStore.onResetForm();

  if (panelUserFormStore.isEditing()) {
    panelUserFormStore.onFetchItemUser();
  }
});
</script>
