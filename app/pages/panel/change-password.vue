<template>
  <PanelChangePasswordForm />
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
    text: $i18n().t('common.change_password'),
    to: '/panel/change-password',
  },
]);

useHead({
  title: $i18n().t('common.change_password'),
});
</script>
