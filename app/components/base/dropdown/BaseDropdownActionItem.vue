<template>
  <NuxtLink v-if="props.to" :to="props.to" :class="itemClass">
    <BaseIcon v-if="props.icon" :name="props.icon" size="sm" />
    {{ props.text }}
  </NuxtLink>
  <div v-else :class="itemClass">
    <BaseIcon v-if="props.icon" :name="props.icon" size="sm" />
    {{ props.text }}
  </div>
</template>

<script lang="ts" setup>
interface Props {
  text: string;
  icon?: string;
  to?: string;
  classes?: {
    color?: string;
  };
}

const props = withDefaults(defineProps<Props>(), {});

const itemClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('flex items-center');
  itemsClass.push('whitespace-nowrap');
  itemsClass.push('select-none');
  itemsClass.push('h-10 w-full');
  itemsClass.push('text-sm');
  itemsClass.push('px-3');
  itemsClass.push('gap-x-2');
  itemsClass.push('rounded-md');
  itemsClass.push('cursor-pointer');

  if (props.classes?.color) {
    itemsClass.push(props.classes.color);
  } else {
    itemsClass.push('text-dark');
    itemsClass.push('dark:text-dark-100');
    itemsClass.push('hover:bg-slate-100/50');
    itemsClass.push('dark:hover:bg-dark-900/50');
  }

  return itemsClass.join(' ');
});
</script>
