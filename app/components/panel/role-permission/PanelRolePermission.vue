<template>
  <BaseCard bordered>
    <BaseCardHead bordered :title="$i18n().t('common.role_permission')" />

    <div class="flex grow select-none flex-col gap-y-4">
      <SelectableUserRole
        v-model="inputForm.role"
        v-model:item="inputForm.role_detail"
        :error="errorForm?.role"
        :label="$i18n().t('common.role')"
        label-required
        class="w-full md:max-w-96"
      />

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
                :disabled="!inputForm.role"
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
    id: null as string | null,
    role: null as string | null,
    role_detail: null as ItemUserRole | null,
    permissions: [] as string[],
  },
  onReset: () => {
    itemRolePermission.value = null;
    inputForm.permissions = [];
  },
  onValidate: () => {
    errorForm.value = $validateInput(inputForm, {
      role: ['is_not_empty'],
    });
  },
});

watch(
  () => inputForm.role,
  () => {
    if (inputForm.role) {
      onFetchItemRolePermission();
    }
  },
);

const loadingSubmitForm = ref(false);
const onSubmitForm = async () => {
  if (!onValidateForm()) return;
  if (loadingSubmitForm.value) return;

  loadingSubmitForm.value = true;

  const res: ApiResponse = await $axios().patch('/role-permissions', inputForm);

  if (res.statusCode === 200) {
    $toast().open({
      type: 'success',
      message: $i18n().t('message.success_updated'),
    });
    onFetchItemRolePermission();
  } else {
    $toast().open({
      type: 'error',
      message: $apiErrorMessage(res),
    });
  }

  loadingSubmitForm.value = false;
};

const itemRolePermission = ref<ItemRolePermission | null>(null);
const loadingItemRolePermission = ref(false);
const onFetchItemRolePermission = async () => {
  loadingItemRolePermission.value = true;

  const res: ApiResponse = await $axios().get(`/role-permissions`, {
    params: {
      role: inputForm.role,
    },
  });

  if (res.statusCode === 200) {
    itemRolePermission.value = res.data;
    if (res.data) {
      $objectAssignTarget(inputForm, res.data);
    } else {
      inputForm.id = null;
      inputForm.permissions = [];
    }
  } else {
    $toast().open({
      type: 'error',
      message: $apiErrorMessage(res),
    });
  }

  loadingItemRolePermission.value = false;
};

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
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });
};

onMounted(() => {
  onResetForm();
});
</script>
