<template>
  <BaseTextLabelContent
    :label="props.label"
    :label-required="props.labelRequired"
    :label-optional="props.labelOptional"
  >
    <slot :error="props.error"></slot>

    <div v-if="props.error" class="text-danger text-xs">
      {{ props.error }}
    </div>
  </BaseTextLabelContent>
</template>

<script lang="ts" setup>
interface Props {
  label?: string;
  labelRequired?: boolean;
  labelOptional?: boolean;
  error?: any;
}

const props = withDefaults(defineProps<Props>(), {});
</script>
