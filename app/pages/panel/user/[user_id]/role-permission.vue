<template>
  <PanelUserRolePermission />
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'panel',
  middleware: ['auth-required'],
});

const route = useRoute();

$breadcrumb().setItems([
  {
    icon: 'ph:house',
    to: '/panel/dashboard',
  },
  {
    text: $i18n().t('common.user'),
    to: '/panel/user',
  },
  {
    text: $i18n().t('common.role_permission'),
    to: `/panel/user/${route.params.user_id}/role-permission`,
  },
]);

$validateRolePermission($userPermissionMatch(['USER_UPDATE']));

useHead({
  title: $i18n().t('common.role_permission'),
});
</script>
