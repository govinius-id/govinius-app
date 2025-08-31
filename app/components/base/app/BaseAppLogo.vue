<template>
  <img :src="logoUrl" alt="logo" draggable="false" class="select-none" />
</template>

<script lang="ts" setup>
interface Props {
  variant?: '';
}

const props = withDefaults(defineProps<Props>(), {});

const logoUrl = computed(() => {
  switch (props.variant) {
    default:
      return '/images/logo/app.png';
  }
});
</script>
