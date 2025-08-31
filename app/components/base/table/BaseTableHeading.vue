<template>
  <th
    :class="headingClass"
    :style="{
      width: props.widthFit ? 0 : props.width,
      minWidth: props.minWidth,
    }"
  >
    <slot></slot>
  </th>
</template>

<script lang="ts" setup>
interface Props {
  align?: 'left' | 'right' | 'center';
  width?: string;
  minWidth?: string;
  widthFit?: boolean;
  stickyLeft?: boolean;
  stickyRight?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  widthFit: false,
  stickyLeft: false,
  stickyRight: false,
});

const headingClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('text-slate-400');
  itemsClass.push('font-medium');
  itemsClass.push('text-xs');
  itemsClass.push('py-3 px-3');
  itemsClass.push('bg-slate-100');
  itemsClass.push('dark:bg-dark-800');

  switch (props.align) {
    case 'left':
      itemsClass.push('text-left');
      break;
    case 'right':
      itemsClass.push('text-right');
      break;
    case 'center':
      itemsClass.push('text-center');
      break;
  }

  if (props.stickyRight) {
    itemsClass.push('sticky right-0 z-[2]');
    itemsClass.push('shadow-[-10px_0_12px_-12px]');
    itemsClass.push('shadow-gray-300/70');
    itemsClass.push('dark:shadow-black/70');
  } else if (props.stickyLeft) {
    itemsClass.push('sticky left-0 z-[2]');
    itemsClass.push('shadow-[10px_0_12px_-12px]');
    itemsClass.push('shadow-gray-300/70');
    itemsClass.push('dark:shadow-black/70');
  }

  return itemsClass.join(' ');
});
</script>
