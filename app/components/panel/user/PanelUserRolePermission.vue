<template>
  <BaseCard bordered>
    <BaseCardHead bordered :title="$i18n().t('common.role_permission')">
      <template #prefix>
        <BaseButtonIcon icon="ph:arrow-left" @click="$router.back()" />
      </template>
    </BaseCardHead>

    <div class="flex grow select-none flex-col gap-y-4">
      <BaseTextLabelContent :label="$i18n().t('common.role')">
        <BaseText>
          {{ itemUser?.role_detail?.text || '-' }}
        </BaseText>
      </BaseTextLabelContent>

      <BaseTextLabelContent :label="$i18n().t('common.role_permission_custom')">
        <BaseInputToggle v-model="inputForm.is_role_permission_custom" />
      </BaseTextLabelContent>

      <div class="flex flex-col gap-y-2">
        <BaseTextLabel>
          {{ $i18n().t('common.permission') }}
        </BaseTextLabel>
        <div
          class="divide-y-1 dark:divide-dark-800 flex flex-col gap-y-4 divide-slate-200"
        >
          <div
            v-for="(objParent, i) in selectableConstStore.itemConst
              ?.items_user_permission"
            :key="i"
            class="flex flex-col gap-y-2 pb-4"
          >
            <BaseText class="text-sm font-semibold">
              {{ objParent.text }}
            </BaseText>
            <div
              class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8"
            >
              <BaseInputCheckbox
                v-for="(objChild, j) in objParent.children"
                :key="j"
                :text="objChild.text"
                :disabled="!inputForm.is_role_permission_custom"
                :model-value="isChecked(objChild.value)"
                @checked="onChecked(objChild.value)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <BaseCardAction>
      <BaseButton
        icon-prefix="ph:check-circle-duotone"
        color="primary"
        type="submit"
        :loading="loadingSubmitForm"
        @click="onSubmitForm()"
      >
        {{ $i18n().t('common.save') }}
      </BaseButton>
    </BaseCardAction>
  </BaseCard>
</template>

<script lang="ts" setup>
const selectableConstStore = useSelectableConstStore();

const { inputForm, errorForm, onResetForm, onValidateForm } = useFormState({
  state: {
    is_role_permission_custom: false,
    permissions: [] as string[],
  },
  onReset: () => {
    itemRolePermission.value = null;
    inputForm.permissions = [];
  },
  onValidate: () => {
    errorForm.value = $validateInput(inputForm, {
      permissions: ['is_not_empty'],
    });
  },
});

const { loadingSubmit: loadingSubmitForm, onSubmit: onSubmitForm } =
  useSubmitState({
    onBeforeSubmit: async () => {
      return onValidateForm();
    },
    onSubmit: async () => {
      return $axios().patch(
        `/users/${useRoute().params.user_id}/role-permission`,
        inputForm,
      );
    },
    onSuccess: () => {
      $toast().open({
        type: 'success',
        message: $i18n().t('message.success_saved'),
      });
      onFetchItemUser();
    },
  });

const { itemDetail: itemUser, onFetchItemDetail: onFetchItemUser } =
  useFetchDetailState({
    state: null as ItemUser | null,
    onFetch: () => {
      return $axios().get(`/users/${useRoute().params.user_id}`);
    },
    onSuccess: async (res) => {
      itemUser.value = res.data;
      $objectAssignTarget(inputForm, res.data);
      onFetchItemRolePermission();
    },
  });

const {
  itemDetail: itemRolePermission,
  onFetchItemDetail: onFetchItemRolePermission,
} = useFetchDetailState({
  state: null as ItemRolePermission | null,
  onFetch: () => {
    return $axios().get(`/role-permissions`, {
      params: {
        role: itemUser.value?.role,
      },
    });
  },
  onSuccess: (res) => {
    itemRolePermission.value = res.data;
    if (!itemUser.value?.is_role_permission_custom && res.data) {
      inputForm.permissions = itemRolePermission.value?.permissions || [];
    }
  },
});

const isChecked = (permissionKey: string) => {
  return inputForm.permissions.includes(permissionKey);
};

const onChecked = (permissionKey: string) => {
  if (isChecked(permissionKey)) {
    const i = inputForm.permissions.findIndex((key) => {
      return key === permissionKey;
    });
    if (i > -1) {
      inputForm.permissions.splice(i, 1);
    }
  } else {
    inputForm.permissions.push(permissionKey);
  }
  inputForm.permissions.sort((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });
};

onMounted(() => {
  onResetForm();
  onFetchItemUser();
});
</script>
