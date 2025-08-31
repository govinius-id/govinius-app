<template>
  <AuthEmailVerification />
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'auth',
  middleware: [],
});

useHead({
  title: $i18n().t('common.email_verification'),
});
</script>
