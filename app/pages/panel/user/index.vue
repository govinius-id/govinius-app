<template>
  <PanelUserList />
  <PanelUserFilter />
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
    text: $i18n().t('common.user'),
    to: '/panel/user',
  },
]);

$validateRolePermission($userPermissionMatch(['USER_LIST']));

useHead({
  title: $i18n().t('common.user'),
});
</script>
