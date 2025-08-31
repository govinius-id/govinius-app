<template>
  <BaseInput
    v-model="inputModel"
    :error="props.error"
    :type="isVisiblePassword ? 'text' : 'password'"
    :label="props.label"
    :label-required="props.labelRequired"
    :label-optional="props.labelOptional"
    :placeholder="props.placeholder"
    :clearable="props.clearable"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :size="props.size"
    icon-prefix="ph:lock-duotone"
    @clear="emit('clear')"
  >
    <template #suffix>
      <div
        class="inline-flex aspect-square h-full cursor-pointer items-center justify-center text-slate-400"
        @click="isVisiblePassword = !isVisiblePassword"
      >
        <BaseIcon
          v-if="isVisiblePassword"
          name="ph:eye-duotone"
          :class="props.size"
        />
        <BaseIcon v-else name="ph:eye-slash-duotone" :size="props.size" />
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

const isVisiblePassword = ref(false);
</script>
