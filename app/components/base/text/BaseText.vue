<template>
  <component :is="props.tag" :class="textClass">
    <slot></slot>
  </component>
</template>

<script lang="ts" setup>
interface Props {
  tag?:
    | 'div'
    | 'span'
    | 'label'
    | 'p'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6';
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
});

const textClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('text-dark');
  itemsClass.push('leading-relaxed');
  itemsClass.push('dark:text-dark-100');

  return itemsClass.join(' ');
});
</script>
