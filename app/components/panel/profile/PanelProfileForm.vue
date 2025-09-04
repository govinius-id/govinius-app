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
            :loading="loadingItemProfile"
            @click="onFetchItemProfile()"
          />
        </BaseTooltip>
      </template>
    </BaseCardHead>

    <div class="flex w-full flex-col gap-y-4 md:max-w-96">
      <BaseInputImage
        v-model="inputForm.picture"
        v-model:file="inputForm.file_picture"
        :label="$i18n().t('common.profile_picture')"
        :preview="itemProfile?.picture_url"
        :allow-extensions="['jpg', 'jpeg', 'png', 'webp']"
        max-size="10MB"
        min-size="1KB"
      >
        <template #image="opts">
          <BaseInputImageCropperHeadless
            v-model="inputForm.file_picture"
            :label="$i18n().t('common.profile_picture')"
            @on-remove="opts.onRemove"
          >
            <BaseImageAvatar :src="opts.src" size="4xl" />
          </BaseInputImageCropperHeadless>
        </template>
      </BaseInputImage>

      <BaseInput
        v-model="inputForm.name"
        :error="errorForm?.name"
        :loading="loadingItemProfile"
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
        v-model="inputForm.username"
        :error="errorForm?.username"
        :loading="loadingItemProfile"
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
        v-model="inputForm.email"
        :error="errorForm?.email"
        :loading="loadingItemProfile"
        :label="$i18n().t('common.email')"
        :placeholder="
          $i18n().t('common.enter_value', {
            value: $i18n().t('common.email').toLowerCase(),
          })
        "
        class="w-full"
        clearable
        @clear="inputForm.email = null"
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
  name: null as string | null,
  username: null as string | null,
  email: null as string | null,
  picture: null as string | null,
  file_picture: null as File | null,
};
const inputForm = reactive($objectClone(inputFormDefault));

const onResetForm = () => {
  errorForm.value = null;
  itemProfile.value = null;
  $objectAssignTarget(inputForm, inputFormDefault);
};

const errorForm = ref<Record<string, any> | null>(null);
const onValidateForm = () => {
  errorForm.value = $validateInput(inputForm, {
    name: ['is_not_empty'],
    username: ['is_not_empty'],
    email: inputForm.email ? ['is_email'] : [],
  });
  return $validateErrorMessage(errorForm.value);
};

const loadingSubmitForm = ref(false);
const onSubmitForm = async () => {
  if (!onValidateForm()) return;
  if (loadingSubmitForm.value) return;

  loadingSubmitForm.value = true;

  const res: ApiResponse = await $axios().patch(
    '/profile',
    $createFormData(inputForm),
  );

  if (res.statusCode === 200) {
    $toast().open({
      type: 'success',
      message: $i18n().t('message.success_updated'),
    });

    $auth().fetchUser();
    navigateTo('/panel/profile');
  } else {
    $toast().open({
      type: 'error',
      message: $apiErrorMessage(res),
    });
  }

  loadingSubmitForm.value = false;
};

const itemProfile = ref<ItemUser | null>(null);
const loadingItemProfile = ref(false);
const onFetchItemProfile = async () => {
  loadingItemProfile.value = true;

  const res: ApiResponse = await $axios().get(`/profile`);

  if (res.statusCode === 200) {
    itemProfile.value = res.data;

    $objectAssignTarget(inputForm, res.data);
  } else {
    $toast().open({
      type: 'error',
      message: $apiErrorMessage(res),
    });
  }

  loadingItemProfile.value = false;
};

onMounted(() => {
  onResetForm();
  onFetchItemProfile();
});
</script>
