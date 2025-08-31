<template>
  <div :class="cardHeadClass">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  bordered: false,
});

const cardHeadClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('select-none');
  itemsClass.push('w-auto');
  itemsClass.push('flex items-center justify-end');
  itemsClass.push('-mb-4 -mx-4 mt-5');
  itemsClass.push('px-3');
  itemsClass.push('gap-2');
  itemsClass.push('rounded-b-xl');
  itemsClass.push('bg-slate-50');
  itemsClass.push('dark:bg-dark-900');

  switch (props.size) {
    case 'sm':
      itemsClass.push('h-12');
      break;
    case 'md':
      itemsClass.push('h-14');
      break;
    case 'lg':
      itemsClass.push('h-16');
      break;
  }

  if (props.bordered) {
    itemsClass.push('border-b');
    itemsClass.push('border-slate-100');
    itemsClass.push('dark:border-dark-900');
  }

  return itemsClass.join(' ');
});
</script>
