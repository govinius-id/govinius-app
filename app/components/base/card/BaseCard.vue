<template>
  <NuxtLink v-if="props.to" :to="props.to" :class="cardClass">
    <slot></slot>
  </NuxtLink>
  <div v-else :class="cardClass">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  shadow?: boolean;
  bordered?: boolean;
  to?: string | object;
  hoverable?: boolean;
  compact?: boolean;
  classes?: {
    color?: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  shadow: false,
  bordered: false,
  hoverable: false,
  compact: false,
});

const cardClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('flex flex-col');
  itemsClass.push('rounded-xl');

  if (props.compact) {
    itemsClass.push('p-2');
  } else {
    itemsClass.push('p-4');
  }

  if (props.classes?.color) {
    itemsClass.push(props.classes.color);
  } else {
    itemsClass.push('bg-white');
    itemsClass.push('dark:bg-dark-950');
  }

  if (props.shadow) {
    itemsClass.push('shadow-[0_20px_18px,0_2px_12px]');
    itemsClass.push('shadow-dark-300/10');
    itemsClass.push('dark:shadow-black/15');
  }

  if (props.hoverable) {
    itemsClass.push('transition-shadow');
    itemsClass.push('duration-300');
    itemsClass.push('hover:shadow-[0_20px_18px,0_2px_12px]');
    itemsClass.push('hover:shadow-dark-300/10');
    itemsClass.push('dark:hover:shadow-black/15');
  }

  if (props.bordered) {
    itemsClass.push('border');
    itemsClass.push('border-slate-100');
    itemsClass.push('dark:border-dark-900');
  }

  return itemsClass.join(' ');
});
</script>
