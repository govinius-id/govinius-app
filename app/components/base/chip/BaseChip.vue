<template>
  <div
    :class="chipClass"
    :style="{
      '--text-color': `${props.color}`,
      '--bg-color': `${props.color}1d`,
    }"
  >
    <div :class="contentClass">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
export interface Props {
  color?: string | null;
  icon?: string | null;
  size?: 'sm' | 'md';
  rounded?: 'rounded' | 'full';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  rounded: 'full',
});

const chipClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('inline-flex justify-center items-center');
  itemsClass.push('min-w-12 max-w-48');
  itemsClass.push('text-sm');
  itemsClass.push('line-clamp-1');
  itemsClass.push('rounded-full');
  itemsClass.push('select-none');

  switch (props.rounded) {
    case 'full':
      itemsClass.push('rounded-full');
      break;
    case 'rounded':
      itemsClass.push('rounded-md');
      break;
  }

  if (props.color) {
    itemsClass.push('bg-[var(--bg-color)]');
    itemsClass.push('text-[var(--text-color)]');
  } else {
    itemsClass.push('bg-slate-100 text-slate-400');
    itemsClass.push('dark:bg-dark-900');
    itemsClass.push('dark:text-dark-400');
  }

  return itemsClass.join(' ');
});

const contentClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('flex items-center gap-1 text-nowrap');

  switch (props.size) {
    case 'sm':
      itemsClass.push('py-1 px-2 text-xs');
      break;
    case 'md':
      itemsClass.push('py-1.5 px-3');
      break;
  }

  return itemsClass.join(' ');
});
</script>
