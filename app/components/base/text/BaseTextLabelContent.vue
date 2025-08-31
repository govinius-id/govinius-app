<template>
  <div class="flex flex-col items-start gap-y-1">
    <BaseTextLabel
      v-if="props.label"
      :required="props.labelRequired"
      :optional="props.labelOptional"
    >
      {{ props.label }}
    </BaseTextLabel>

    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  label?: string;
  labelRequired?: boolean;
  labelOptional?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  labelRequired: false,
  labelOptional: false,
});
</script>
