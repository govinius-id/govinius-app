<template>
  <td ref="cell" :class="cellClass" @click="onClickCell()">
    <slot></slot>
  </td>
</template>

<script lang="ts" setup>
import type {
  RouteLocationAsRelativeGeneric,
  RouteLocationAsPathGeneric,
} from '#vue-router';

interface Props {
  tableId?: string;
  align?: 'left' | 'right' | 'center';
  to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
  stickyLeft?: boolean;
  stickyRight?: boolean;
  classes?: {
    padding?: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  tableId: 'table',
  align: 'left',
  stickyLeft: false,
  stickyRight: false,
});

const cell = ref();

const cellClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('border-b');
  itemsClass.push('border-slate-200');
  itemsClass.push('dark:border-dark-800');

  if (props.to) {
    itemsClass.push('cursor-pointer');
  }

  if (props.classes?.padding) {
    itemsClass.push(props.classes?.padding);
  } else {
    itemsClass.push('p-3');
  }

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
    itemsClass.push('sticky right-0 z-[3]');
    itemsClass.push('bg-white');
    itemsClass.push('shadow-[-10px_0_12px_-12px]');
    itemsClass.push('shadow-gray-300/50');
    itemsClass.push('dark:bg-dark-950');
    itemsClass.push('dark:shadow-black/50');
  } else if (props.stickyLeft) {
    itemsClass.push('sticky left-0 z-[2]');
    itemsClass.push('bg-white');
    itemsClass.push('shadow-[10px_0_12px_-12px]');
    itemsClass.push('shadow-gray-300/50');
    itemsClass.push('dark:bg-dark-950');
    itemsClass.push('dark:shadow-black/50');
  }

  return itemsClass.join(' ');
});

const onClickCell = () => {
  if (props.to) {
    navigateTo(props.to);
  }
};
</script>
