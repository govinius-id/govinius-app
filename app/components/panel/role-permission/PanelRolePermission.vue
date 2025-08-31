<template>
  <BaseCard bordered>
    <BaseCardHead bordered :title="$i18n().t('common.role_permission')" />

    <div class="flex grow select-none flex-col gap-y-4">
      <SelectableUserRole
        v-model="panelRolePermissionStore.inputForm.role"
        v-model:item="panelRolePermissionStore.inputForm.role_detail"
        :error="panelRolePermissionStore.errorForm?.role"
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
                :disabled="!panelRolePermissionStore.inputForm.role"
                :model-value="
                  panelRolePermissionStore.isChecked(objChild.value)
                "
                @checked="panelRolePermissionStore.onChecked(objChild.value)"
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
        :loading="panelRolePermissionStore.loadingSubmitForm"
        @click="panelRolePermissionStore.onSubmitForm()"
      >
        {{ $i18n().t('common.save') }}
      </BaseButton>
    </BaseCardAction>
  </BaseCard>
</template>

<script lang="ts" setup>
const selectableConstStore = useSelectableConstStore();
const panelRolePermissionStore = usePanelRolePermissionStore();

onMounted(() => {
  panelRolePermissionStore.onResetForm();
});
</script>
