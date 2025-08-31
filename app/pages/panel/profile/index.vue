<template>
  <PanelProfile />
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
    text: $i18n().t('common.profile'),
    to: '/panel/profile',
  },
]);

useHead({
  title: $i18n().t('common.profile'),
});
</script>
