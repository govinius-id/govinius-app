<template>
  <label :class="textLabelClass">
    <slot></slot>
    <span v-if="props.required" class="text-danger ml-1">*</span>
    <span
      v-if="props.optional"
      class="text-dark-400/50 ml-0.5 text-xs font-light"
    >
      ({{ $i18n().t('common.optional') }})
    </span>
  </label>
</template>

<script lang="ts" setup>
interface Props {
  required?: boolean;
  optional?: boolean;
}

const props = withDefaults(defineProps<Props>(), {});

const textLabelClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('text-sm');
  itemsClass.push('text-dark-400');
  itemsClass.push('select-none');

  return itemsClass.join(' ');
});
</script>
