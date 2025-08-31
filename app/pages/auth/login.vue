<template>
  <AuthLogin />
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'auth',
  middleware: ['auth-redirect-panel'],
});

useHead({
  title: $i18n().t('common.login'),
});
</script>
