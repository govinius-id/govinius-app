<template>
  <Icon :icon="props.name" :class="iconClass" />
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue';

interface Props {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {});

const iconClass = computed(() => {
  const itemsClass: string[] = [];

  if (props.size === 'sm') {
    itemsClass.push('size-[16px] min-w-[16px]');
  }

  if (props.size === 'md') {
    itemsClass.push('size-[18px] min-w-[18px]');
  }

  if (props.size === 'lg') {
    itemsClass.push('size-[20px] min-w-[20px]');
  }

  return itemsClass.join(' ');
});
</script>
