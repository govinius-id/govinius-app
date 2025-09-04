<template>
  <PanelUserForm />
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
  {
    text: $i18n().t('common.edit'),
    to: `/panel/user/${useRoute().params.user_id}/edit`,
  },
]);

$validateRolePermission($userPermissionMatch(['USER_UPDATE']));

useHead({
  title: $i18n().t('common.edit_value', { value: $i18n().t('common.user') }),
});
</script>
