<template>
  <BaseCard bordered>
    <BaseCardHead
      :title="
        isEditing()
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
          v-if="isEditing()"
          :text="$i18n().t('common.refresh')"
          position="bottom"
        >
          <BaseButtonIcon
            icon="ph:arrow-clockwise"
            :loading="loadingItemUser"
            @click="onFetchItemUser()"
          />
        </BaseTooltip>
      </template>
    </BaseCardHead>

    <div class="flex w-full flex-col gap-y-4 md:max-w-96">
      <BaseInputImage
        v-model="inputForm.picture"
        v-model:file="inputForm.file_picture"
        :label="$i18n().t('common.profile_picture')"
        :preview="itemUser?.picture_url"
        :loading="loadingItemUser"
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
        :loading="loadingItemUser"
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
        :loading="loadingItemUser"
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
        v-model="inputForm.email"
        :error="errorForm?.email"
        :loading="loadingItemUser"
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
        v-model="inputForm.password"
        :error="errorForm?.password"
        :loading="loadingItemUser"
        :clearable="isEditing()"
        :label="
          isEditing()
            ? $i18n().t('common.new_password')
            : $i18n().t('common.password')
        "
        :placeholder="
          $i18n().t('common.enter_value', {
            value: isEditing()
              ? $i18n().t('common.new_password').toLowerCase()
              : $i18n().t('common.password').toLowerCase(),
          })
        "
        :label-required="!isEditing()"
        :label-optional="isEditing()"
        class="w-full"
        @clear="inputForm.password = null"
      />

      <SelectableUserRole
        v-model="inputForm.role"
        v-model:item="inputForm.role_detail"
        :error="errorForm?.role"
        :loading="loadingItemUser"
        :label="$i18n().t('common.role')"
        class="w-full"
        label-required
      />

      <BaseTextLabelContent :label="$i18n().t('common.active')">
        <BaseInputToggle v-model="inputForm.is_active" />
      </BaseTextLabelContent>
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
const isEditing = () => {
  return $isNotEmpty(useRoute().params.user_id);
};

const { inputForm, errorForm, onResetForm, onValidateForm } = useFormState({
  state: {
    name: null as string | null,
    username: null as string | null,
    email: null as string | null,
    password: null as string | null,
    role: null as string | null,
    role_detail: null as ItemUserRole | null,
    is_active: true,
    picture: null as string | null,
    file_picture: null as File | null,
  },
  onReset: () => {
    itemUser.value = null;
  },
  onValidate: () => {
    errorForm.value = $validateInput(inputForm, {
      name: ['is_not_empty'],
      username: ['is_not_empty'],
      email: inputForm.email ? ['is_email'] : [],
      password: !isEditing() ? ['is_not_empty'] : [],
      role: ['is_not_empty'],
    });
  },
});

const { loadingSubmit: loadingSubmitForm, onSubmit: onSubmitForm } =
  useSubmitState({
    onBeforeSubmit: async () => {
      return onValidateForm();
    },
    onSubmit: () => {
      if (isEditing()) {
        return $axios().put(
          `/users/${useRoute().params.user_id}`,
          $createFormData(inputForm),
        );
      } else {
        return $axios().post('/users', $createFormData(inputForm));
      }
    },
    onSuccess: (res) => {
      $toast().open({
        type: 'success',
        message: $i18n().t('message.success_saved'),
      });
      if (res.statusCode === 200) {
        onFetchItemUser();
      } else if (res.statusCode === 201) {
        navigateTo('/panel/user');
      }
    },
  });

const {
  itemDetail: itemUser,
  loadingItemDetail: loadingItemUser,
  onFetchItemDetail: onFetchItemUser,
} = useFetchDetailState({
  state: null as ItemUser | null,
  onFetch: () => {
    return $axios().get(`/users/${useRoute().params.user_id}`);
  },
  onSuccess: (res) => {
    itemUser.value = res.data;
    $objectAssignTarget(inputForm, res.data);
  },
});

onMounted(() => {
  onResetForm();

  if (isEditing()) {
    onFetchItemUser();
  }
});
</script>
