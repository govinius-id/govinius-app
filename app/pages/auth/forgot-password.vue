<template>
  <AuthForgotPassword />
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'auth',
  middleware: [],
});

useHead({
  title: $i18n().t('common.forgot_password'),
});
</script>
