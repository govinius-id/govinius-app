<template>
  <PanelUserDetail />
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
    text: $i18n().t('common.detail'),
    to: `/panel/user/${route.params.user_id}/detail`,
  },
]);

$validateRolePermission($userPermissionMatch(['USER_DETAIL']));

useHead({
  title: $i18n().t('common.detail_value', { value: $i18n().t('common.user') }),
});
</script>
