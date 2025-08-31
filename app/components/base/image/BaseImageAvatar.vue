<template>
  <div :class="avatarClass">
    <img
      v-if="!isLoading"
      :src="imageUrl"
      alt="avatar"
      :class="avatarImageClass"
      draggable="false"
    />
  </div>
</template>

<script lang="ts" setup>
import { useImage } from '@vueuse/core';

interface Props {
  src?: string | null;
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  rounded?: 'rounded' | 'full';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  rounded: 'full',
});

const imageUrl = computed(() => {
  if (props.src) {
    return props.src;
  } else {
    return $themeMode() === 'dark'
      ? '/images/placeholder/avatar-dark.png'
      : '/images/placeholder/avatar.png';
  }
});

const { isLoading } = useImage({ src: imageUrl.value });

const avatarClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('relative');
  itemsClass.push('select-none');
  itemsClass.push('overflow-hidden');
  itemsClass.push('bg-slate-100');
  itemsClass.push('dark:bg-dark-900');

  if (isLoading.value) {
    itemsClass.push('animate-pulse');
  }

  switch (props.rounded) {
    case 'rounded':
      itemsClass.push('rounded-md');
      break;
    case 'full':
      itemsClass.push('rounded-full');
      break;
  }

  itemsClass.push(avatarSizeClass.value);

  return itemsClass.join(' ');
});

const avatarImageClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('bg-white');
  itemsClass.push('object-cover');
  itemsClass.push('duration-100');
  itemsClass.push('hover:scale-105');
  itemsClass.push('dark:bg-dark-950');
  itemsClass.push(avatarSizeClass.value);

  return itemsClass.join(' ');
});

const avatarSizeClass = computed(() => {
  const itemsClass: string[] = [];

  switch (props.size) {
    case 'xxs':
      itemsClass.push('w-6 min-w-6 max-w-6 h-6 min-h-6 max-h-6');
      break;
    case 'xs':
      itemsClass.push('w-8 min-w-8 max-w-8 h-8 min-h-8 max-h-8');
      break;
    case 'sm':
      itemsClass.push('w-10 min-w-10 max-w-10 h-10 min-h-10 max-h-10');
      break;
    case 'md':
      itemsClass.push('w-12 min-w-12 max-w-12 h-12 min-h-12 max-h-12');
      break;
    case 'lg':
      itemsClass.push('w-16 min-w-16 max-w-16 h-16 min-h-16 max-h-16');
      break;
    case 'xl':
      itemsClass.push('w-20 min-w-20 max-w-20 h-20 min-h-20 max-h-20');
      break;
    case '2xl':
      itemsClass.push('w-24 min-w-24 max-w-24 h-24 min-h-24 max-h-24');
      break;
    case '3xl':
      itemsClass.push('w-28 min-w-28 max-w-28 h-28 min-h-28 max-h-28');
      break;
    case '4xl':
      itemsClass.push('w-32 min-w-32 max-w-32 h-32 min-h-32 max-h-32');
      break;
  }

  return itemsClass.join(' ');
});
</script>
