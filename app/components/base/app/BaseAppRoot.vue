<template>
  <div
    id="app-root"
    class="min-w-dvw max-w-dvw relative h-dvh max-h-dvh min-h-dvh w-dvw"
  >
    <div id="app-top"></div>
    <slot></slot>
    <div id="app-bottom"></div>
  </div>

  <BaseModalDialog />
  <BaseModalLightbox />
  <BaseToast />
</template>

<script lang="ts" setup>
if (import.meta.client) {
  document.documentElement.classList.add('[-ms-overflow-style:none]');
  document.documentElement.classList.add('[scrollbar-width:none]');
  document.documentElement.classList.add('[&::-webkit-scrollbar]:hidden');
}

if (import.meta.server) {
  useHead({
    bodyAttrs: {
      class:
        '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    },
  });
}
</script>
