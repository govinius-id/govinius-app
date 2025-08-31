<template>
  <BaseInput
    ref="inputCurrencyRef"
    v-model="inputModel"
    :error="props.error"
    :label="props.label"
    :label-required="props.labelRequired"
    :label-optional="props.labelOptional"
    :placeholder="props.placeholder"
    :clearable="props.clearable"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :classes="{
      text: 'text-right',
    }"
    inputmode="decimal"
    @focus="inputCurrencyRef?.select()"
    @clear="emit('clear')"
    @keydown="$keydownCurrency"
  />
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
  code?: string;
  min?: number;
  max?: number;
}

const emit = defineEmits(['update:modelValue', 'clear', 'change']);
const props = withDefaults(defineProps<Props>(), {
  code: 'IDR',
});

const inputModel = computed({
  get() {
    if ($isNotEmpty(props.modelValue)) {
      return $convertToCurrency(props.modelValue, props.code);
    } else {
      return props.modelValue;
    }
  },
  set(value: number | null) {
    if ($isNotEmpty(value)) {
      emit('update:modelValue', $convertParseCurrency(value, props.code));
    } else {
      emit('update:modelValue', value);
    }
  },
});

watch(
  () => props.modelValue,
  () => {
    emit('change', props.modelValue);

    if (
      inputModel.value &&
      props.max !== null &&
      props.max !== undefined &&
      inputModel.value > props.max
    ) {
      inputModel.value = props.max;
    }

    if (
      inputModel.value &&
      props.min !== null &&
      props.min !== undefined &&
      inputModel.value < props.min
    ) {
      inputModel.value = props.min;
    }
  },
);

const inputCurrencyRef = ref();

const triggerFocus = () => {
  inputCurrencyRef.value?.focus();
};

const triggerSelect = () => {
  inputCurrencyRef.value?.select();
};

defineExpose({
  focus: triggerFocus,
  select: triggerSelect,
});
</script>
