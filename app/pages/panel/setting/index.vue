<template>
  <PanelSettingList />
  <PanelSettingForm />
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'panel',
  middleware: ['auth-required'],
});

$breadcrumb().setItems([
  {
    icon: 'ph:house',
    to: '/panel/dashboard',
  },
  {
    text: $i18n().t('common.setting'),
    to: '/panel/setting',
  },
]);

$validateRolePermission($userPermissionMatch(['SETTING_LIST']));

useHead({
  title: $i18n().t('common.setting'),
});
</script>
