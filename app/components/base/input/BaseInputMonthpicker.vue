<template>
  <BaseDropdown>
    <template #activator="opts">
      <BaseInput
        ref="inputActivatorRef"
        :model-value="inputContent"
        :error="props.error"
        :label="props.label"
        :label-required="props.labelRequired"
        :label-optional="props.labelOptional"
        :placeholder="props.placeholder || 'mm yyyy'"
        :clearable="props.clearable"
        :disabled="props.disabled"
        icon-prefix="ph:calendar-duotone"
        readonly
        @click="opts.onToggle()"
        @keydown="
          $keydownPressKey($event, 'Enter', opts.onToggle);
          $keydownPressKey($event, 'Tab', opts.onClose);
        "
        @clear="emit('clear')"
      />
    </template>
    <template #content="opts">
      <BaseCard bordered shadow compact>
        <BaseCalendar
          v-model="inputModel"
          :start-date="props.startDate"
          :end-date="props.endDate"
          :time-of-picker="props.timeOfPicker"
          type-of-picker="month"
          @select="
            select();
            opts.onClose();
          "
        />
      </BaseCard>
    </template>
  </BaseDropdown>
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
  month?: string | number | null;
  year?: string | number | null;
  startDate?: string | null;
  endDate?: string | null;
  timeOfPicker?: 'start' | 'end' | null;
}

const emit = defineEmits([
  'update:modelValue',
  'update:month',
  'update:year',
  'clear',
  'select',
]);
const props = defineProps<Props>();

const inputModel = computed({
  get() {
    return props.modelValue;
  },
  set(value: string | null) {
    emit('update:modelValue', value);
    emit('update:month', value ? $dayjs().tz(value).format('M') : value);
    emit('update:year', value ? $dayjs().tz(value).format('YYYY') : value);
  },
});

const inputContent = computed(() => {
  if (!props.modelValue) return null;
  return $dayjs()
    .tz(props.modelValue, $timezone())
    .tz($timezone())
    .format('MMM YYYY');
});

const inputActivatorRef = ref();

const select = () => {
  emit('select', props.modelValue);
  inputActivatorRef.value?.focus();
};
</script>
