<template>
  <BaseInputFileUploadHeadless v-model="inputModel">
    <template #default="opts">
      <BaseInput
        :model-value="inputContentText"
        :error="props.error"
        :label="props.label"
        :label-required="props.labelRequired"
        :label-optional="props.labelOptional"
        :placeholder="props.placeholder"
        :clearable="props.clearable"
        :disabled="props.disabled"
        :size="props.size"
        class="w-full"
        icon-prefix="ph:folder-bold"
        readonly
        @click="opts.onOpen()"
        @clear="emit('clear')"
      />
    </template>
  </BaseInputFileUploadHeadless>
</template>

<script lang="ts" setup>
interface Props {
  modelValue: any;
  error?: string | null;
  label?: string;
  labelRequired?: boolean;
  labelOptional?: boolean;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  preview?: any;
}

const emit = defineEmits(['update:modelValue', 'clear']);
const props = withDefaults(defineProps<Props>(), {});

const inputModel = computed({
  get() {
    return props.modelValue;
  },
  set(value: string | null) {
    emit('update:modelValue', value);
  },
});

const inputContentText = computed(() => {
  if (inputModel.value) {
    if (inputModel.value instanceof File) {
      return inputModel.value?.name;
    }
    return inputModel.value;
  }
  return props.preview;
});
</script>
