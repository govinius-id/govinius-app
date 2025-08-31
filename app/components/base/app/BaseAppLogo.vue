<template>
  <img :src="logoUrl" alt="logo" draggable="false" class="select-none" />
</template>

<script lang="ts" setup>
interface Props {
  variant?: 'white';
}

const props = withDefaults(defineProps<Props>(), {});

const logoUrl = computed(() => {
  switch (props.variant) {
    case 'white':
      return '/images/logo/app-white.png';
    default:
      return '/images/logo/app.png';
  }
});
</script>
