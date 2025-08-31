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
    text: $i18n().t('common.add'),
    to: '/panel/user/add',
  },
]);

$validateRolePermission($userPermissionMatch(['USER_CREATE']));

useHead({
  title: $i18n().t('common.add_value', { value: $i18n().t('common.user') }),
});
</script>
