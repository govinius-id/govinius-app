<template>
  <div :class="imageClass">
    <img
      v-if="!isLoading"
      :src="imageUrl"
      alt="image"
      class="dark:bg-dark-950 h-full w-full bg-white object-cover object-center"
      draggable="false"
    />
  </div>
</template>

<script lang="ts" setup>
import { useImage } from '@vueuse/core';

interface Props {
  src?: string | null;
}

const props = withDefaults(defineProps<Props>(), {});

const imageUrl = computed(() => {
  if (props.src) {
    return props.src;
  } else {
    return $themeMode() === 'dark'
      ? '/images/placeholder/picture-dark.png'
      : '/images/placeholder/picture.png';
  }
});

const { isLoading } = useImage({ src: imageUrl.value });

const imageClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('relative');
  itemsClass.push('select-none');
  itemsClass.push('overflow-hidden');
  itemsClass.push('bg-slate-100');
  itemsClass.push('dark:bg-dark-900');

  if (isLoading.value) {
    itemsClass.push('animate-pulse');
  }

  return itemsClass.join(' ');
});
</script>
