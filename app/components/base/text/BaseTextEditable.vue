<template>
  <BaseTextAction
    v-if="!isEditing"
    icon="ph:note-pencil"
    :size="props.size"
    :class="props.class"
    @click="onToggleEditing()"
  >
    <slot></slot>
  </BaseTextAction>

  <slot v-else name="input" :on-toggle-editing="onToggleEditing"></slot>
</template>

<script lang="ts" setup>
interface Props {
  class?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  disabled: false,
});

const isEditing = ref(false);

const onToggleEditing = () => {
  if (props.disabled) return;
  isEditing.value = !isEditing.value;
};
</script>
