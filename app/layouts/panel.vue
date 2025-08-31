<template>
  <BaseLayoutPanel>
    <template #sidebar-header>
      <BaseAppLogo
        :variant="$themeMode() === 'dark' ? 'white' : undefined"
        class="w-10 min-w-10"
      />
      <div class="grow"></div>
    </template>
    <template #sidebar-content="opts">
      <div class="flex select-none flex-col gap-y-5 pb-20">
        <BaseListMenu
          v-if="constItemsPanelMainMenu().length > 0"
          :title="$i18n().t('common.main_menu')"
          :items="constItemsPanelMainMenu()"
          @select="$breakpoint().is_lg_and_up ? undefined : opts.onClose()"
        />

        <BaseListMenu
          v-if="constItemsPanelMasterMenu().length > 0"
          :title="$i18n().t('common.master_menu')"
          :items="constItemsPanelMasterMenu()"
          @select="$breakpoint().is_lg_and_up ? undefined : opts.onClose()"
        />

        <BaseListMenu
          v-if="constItemsPanelOtherMenu().length > 0"
          :title="$i18n().t('common.other_menu')"
          :items="constItemsPanelOtherMenu()"
          @select="$breakpoint().is_lg_and_up ? undefined : opts.onClose()"
        />
      </div>
    </template>
    <template #navbar-left>
      <BaseBreadcrumb />
    </template>
    <template #navbar-right>
      <BaseAppAccountMenu />
    </template>
    <template #main-content>
      <slot></slot>
    </template>
    <template #footer>
      <BaseAppCopyright />
      <BaseAppSignature class="lg:ml-auto" />
    </template>
  </BaseLayoutPanel>
</template>

<script lang="ts" setup>
const settingStore = useSettingStore();
const selectableConstStore = useSelectableConstStore();

onMounted(() => {
  selectableConstStore.onFetchItemConst();
  settingStore.onFetchItemSetting();
});
</script>
