<template>
  <PanelProfileForm />
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
  {
    text: $i18n().t('common.edit'),
    to: '/panel/profile/edit',
  },
]);

useHead({
  title: $i18n().t('common.edit_value', {
    value: $i18n().t('common.profile'),
  }),
});
</script>
