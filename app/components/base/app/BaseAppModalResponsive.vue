<template>
  <slot
    v-if="$slots.activator"
    name="activator"
    :is-open="modalModel"
    :on-open="onOpenModal"
    :on-close="onCloseModal"
    :on-toggle="onToggleModal"
    :class="props.class"
  ></slot>

  <component
    :is="$breakpoint().is_md_and_down ? BaseSheetBottom : BaseModalCard"
    v-model="modalModel"
    :title="props.title"
    v-bind="
      $breakpoint().is_md_and_down
        ? { initialFraction: props.initialFraction }
        : { size: props.size }
    "
  >
    <template #content>
      <slot
        name="content"
        :is-open="modalModel"
        :on-open="onOpenModal"
        :on-close="onCloseModal"
        :on-toggle="onToggleModal"
      ></slot>
    </template>
    <template v-if="$slots.action" #action>
      <slot
        name="action"
        :is-open="modalModel"
        :on-open="onOpenModal"
        :on-close="onCloseModal"
        :on-toggle="onToggleModal"
      ></slot>
    </template>
  </component>
</template>

<script lang="ts" setup>
import { BaseSheetBottom, BaseModalCard } from '#components';

interface Props {
  modelValue: boolean;
  title?: string;
  class?: string;
  initialFraction?: number;
  size?: 'md' | 'sm' | 'lg' | 'xl' | '2xl';
}

const emit = defineEmits(['update:modelValue']);
const props = withDefaults(defineProps<Props>(), {
  initialFraction: 0.75,
});

const modalModel = computed({
  get() {
    return props.modelValue;
  },
  set(value: boolean) {
    emit('update:modelValue', value);
  },
});

const onOpenModal = () => {
  modalModel.value = true;
};

const onCloseModal = () => {
  modalModel.value = false;
};

const onToggleModal = () => {
  if (modalModel.value) {
    onCloseModal();
  } else {
    onOpenModal();
  }
};

defineExpose({
  modalModel: modalModel,
});
</script>
