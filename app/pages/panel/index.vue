<template>
  <div></div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'panel',
  middleware: ['auth-required'],
});

navigateTo('/panel/dashboard', { replace: true });
</script>
