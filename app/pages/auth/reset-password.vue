<template>
  <AuthResetPassword />
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'auth',
  middleware: [],
});

useHead({
  title: $i18n().t('common.reset_password'),
});
</script>
