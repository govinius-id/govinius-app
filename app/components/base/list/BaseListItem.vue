<template>
  <div
    tabindex="0"
    :class="listItemClass"
    @click="emit('click')"
    @keydown="
      $keydownPressKey($event, 'Enter', () => {
        emit('click');
      })
    "
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  active?: boolean;
  bordered?: boolean;
}

const emit = defineEmits(['click']);
const props = withDefaults(defineProps<Props>(), {
  active: false,
  bordered: false,
});

const listItemClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('flex items-center');
  itemsClass.push('min-h-10 w-full');
  itemsClass.push('px-3 py-1.5');
  itemsClass.push('rounded-md');
  itemsClass.push('text-sm');
  itemsClass.push('cursor-pointer');
  itemsClass.push('text-dark');
  itemsClass.push('focus:outline-none');
  itemsClass.push('focus:ring-2');
  itemsClass.push('focus:ring-primary');
  itemsClass.push('focus:ring-inset');
  itemsClass.push('dark:focus:ring-primary-900');
  itemsClass.push('dark:text-dark-100');

  if (props.active) {
    itemsClass.push('bg-slate-100');
    itemsClass.push('dark:bg-dark-800');
  } else {
    itemsClass.push('hover:bg-slate-100/40');
    itemsClass.push('dark:hover:bg-dark-800/40');
  }

  if (props.bordered) {
    itemsClass.push('border');
    itemsClass.push('border-slate-200');
    itemsClass.push('focus:border-transparent');
    itemsClass.push('dark:border-dark-800');
    itemsClass.push('dark:focus:border-transparent');
  }

  return itemsClass.join(' ');
});
</script>
