<template>
  <tr :class="rowClass">
    <slot></slot>
  </tr>
</template>

<script lang="ts" setup>
const rowClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('group/row');
  itemsClass.push('hover:shadow-[0_3px_15px_-5px]');
  itemsClass.push('hover:shadow-gray-300/50');
  itemsClass.push('dark:hover:shadow-black/50');

  return itemsClass.join(' ');
});
</script>
