<template>
  <BaseInput
    v-model="inputModel"
    :error="props.error"
    :label="props.label"
    :label-required="props.labelRequired"
    :label-optional="props.labelOptional"
    :placeholder="props.placeholder"
    :clearable="props.clearable"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :size="props.size"
    @keydown="$keydownOnlyNumber($event)"
    @clear="emit('clear')"
  >
    <template #prefix>
      <div
        class="flex aspect-square h-full cursor-pointer items-center justify-center text-slate-400"
        @click="onDecrease()"
      >
        <BaseIcon name="ph:minus-circle-bold" :size="props.size" />
      </div>
    </template>
    <template #suffix>
      <div
        class="flex aspect-square h-full cursor-pointer items-center justify-center text-slate-400"
        @click="onIncrease()"
      >
        <BaseIcon name="ph:plus-circle-bold" :size="props.size" />
      </div>
    </template>
  </BaseInput>
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
  min?: number;
  max?: number;
}

const emit = defineEmits(['update:modelValue', 'clear', 'change']);
const props = defineProps<Props>();

const inputModel = computed({
  get() {
    return props.modelValue;
  },
  set(value: string | null) {
    emit('update:modelValue', value ? Number(value) : value);
  },
});

watch(
  () => props.modelValue,
  () => {
    emit('change', props.modelValue);
  },
);

watch(inputModel, (value) => {
  let numberValue = Number(value);

  if (Number.isNaN(numberValue)) return;

  if (props.min !== undefined && numberValue < props.min) {
    numberValue = props.min;
  }

  if (props.max !== undefined && numberValue > props.max) {
    numberValue = props.max;
  }

  if (numberValue !== value) {
    inputModel.value = numberValue.toString();
  }
});

const onIncrease = () => {
  if (props.max !== undefined && inputModel.value >= props.max) return;
  inputModel.value++;
};

const onDecrease = () => {
  if (props.min !== undefined && inputModel.value <= props.min) return;
  inputModel.value--;
};
</script>
