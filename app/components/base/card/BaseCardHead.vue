<template>
  <div :class="cardHeadClass">
    <slot name="prefix"></slot>

    <h1 :class="cardHeadTitleClass">
      {{ props.title }}
    </h1>

    <slot name="suffix"></slot>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  shadow?: boolean;
  bordered?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  shadow: false,
  bordered: false,
});

const cardHeadClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('select-none');
  itemsClass.push('w-auto');
  itemsClass.push('flex items-center');
  itemsClass.push('-mt-4 -mx-4 mb-4');
  itemsClass.push('px-4');
  itemsClass.push('gap-3');
  itemsClass.push('rounded-t-xl');

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

  if (props.shadow) {
    switch (props.size) {
      case 'sm':
        itemsClass.push('shadow-[0_25px_18px_-23px]');
        break;
      case 'md':
        itemsClass.push('shadow-[0_25px_20px_-25px]');
        break;
      case 'lg':
        itemsClass.push('shadow-[0_25px_20px_-30px]');
        break;
    }

    itemsClass.push('shadow-gray-400/20');
    itemsClass.push('dark:shadow-black/40');
  }

  if (props.bordered) {
    itemsClass.push('border-b');
    itemsClass.push('border-slate-100');
    itemsClass.push('dark:border-dark-900');
  }

  return itemsClass.join(' ');
});

const cardHeadTitleClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('w-full');
  itemsClass.push('line-clamp-1');
  itemsClass.push('text-dark');
  itemsClass.push('dark:text-dark-100');

  switch (props.size) {
    case 'sm':
      itemsClass.push('font-medium');
      break;
    case 'md':
      itemsClass.push('text-lg font-medium');
      break;
    case 'lg':
      itemsClass.push('text-xl font-semibold');
      break;
  }

  return itemsClass.join(' ');
});
</script>
