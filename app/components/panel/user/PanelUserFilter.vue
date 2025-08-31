<template>
  <BaseModalCard
    v-model="panelUserListStore.isModalOpenFilter"
    :title="$i18n().t('common.filter')"
  >
    <template #content>
      <SelectableUserRole
        v-model="panelUserListStore.inputFilter.role"
        v-model:item="panelUserListStore.inputFilter.role_detail"
        :label="$i18n().t('common.role')"
        clearable
        @clear="
          panelUserListStore.inputFilter.role = null;
          panelUserListStore.inputFilter.role_detail = null;
        "
      />

      <SelectableActiveStatus
        v-model="panelUserListStore.inputFilter.active_status"
        v-model:item="panelUserListStore.inputFilter.active_status_detail"
        :label="$i18n().t('common.active')"
        clearable
        @clear="
          panelUserListStore.inputFilter.active_status = null;
          panelUserListStore.inputFilter.active_status_detail = null;
        "
      />
    </template>

    <template #action>
      <BaseButton tabindex="-1" @click="panelUserListStore.onResetFilter()">
        {{ $i18n().t('common.clear') }}
      </BaseButton>

      <BaseButton color="primary" @click="panelUserListStore.onApplyFilter()">
        {{ $i18n().t('common.apply') }}
      </BaseButton>
    </template>
  </BaseModalCard>
</template>

<script lang="ts" setup>
const panelUserListStore = usePanelUserListStore();

onMounted(() => {
  panelUserListStore.isModalOpenFilter = false;
});
</script>
