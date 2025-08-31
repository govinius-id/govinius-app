<template>
  <div class="flex items-start justify-start gap-2">
    <BaseText v-if="props.label" :class="textLabelClass">
      {{ props.label }}
    </BaseText>

    <BaseText class="!text-dark-500 w-fit text-sm">:</BaseText>

    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  label?: string;
  classes?: {
    label?: string;
  };
}

const props = withDefaults(defineProps<Props>(), {});

const textLabelClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('!text-dark-500');
  itemsClass.push('text-sm');
  itemsClass.push('w-full');

  if (props.classes?.label) {
    itemsClass.push(props.classes.label);
  } else {
    itemsClass.push('min-w-32');
    itemsClass.push('max-w-32');
    itemsClass.push('md:min-w-48');
    itemsClass.push('md:max-w-48');
  }

  return itemsClass.join(' ');
});
</script>
