<template>
  <BaseTextAction
    :icon="props.text ? 'ph:copy-duotone' : undefined"
    :size="props.size"
    :class="props.class"
    @click="onCopyText()"
  >
    <slot></slot>
  </BaseTextAction>
</template>

<script lang="ts" setup>
interface Props {
  class?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  textName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
});

const onCopyText = () => {
  if (!props.text) return;
  $copyToClipboard(props.text, props.textName);
};
</script>
