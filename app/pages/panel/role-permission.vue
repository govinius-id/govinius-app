<template>
  <PanelRolePermission />
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
    text: $i18n().t('common.role_permission'),
    to: '/panel/role-permission',
  },
]);

$validateRolePermission($userRoleMatch(['ADMIN']));

useHead({
  title: $i18n().t('common.role_permission'),
});
</script>
