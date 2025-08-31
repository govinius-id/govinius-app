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
        :placeholder="props.placeholder || 'dd mm yyyy'"
        :clearable="props.clearable"
        :disabled="props.disabled"
        :size="props.size"
        icon-prefix="ph:calendar-blank-duotone"
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
      <BaseCard bordered shadow compact class="min-w-80">
        <BaseCalendar
          v-model="inputModel"
          :start-date="props.startDate"
          :end-date="props.endDate"
          :disable-dates="props.disableDates"
          :events="props.events"
          @select="
            onSelectItem();
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
  startDate?: string | null;
  endDate?: string | null;
  disableDates?: string[];
  events?: BaseCalendarEvent[];
}

const emit = defineEmits(['update:modelValue', 'clear', 'select']);
const props = withDefaults(defineProps<Props>(), {});

const inputModel = computed({
  get() {
    return props.modelValue;
  },
  set(value: string | null) {
    emit('update:modelValue', value);
  },
});

const inputContent = computed(() => {
  if (!props.modelValue) return null;
  return $dayjs()
    .tz(props.modelValue, $timezone())
    .tz($timezone())
    .format('DD MMM YYYY');
});

const inputActivatorRef = ref();

const onSelectItem = () => {
  emit('select', props.modelValue);
  inputActivatorRef.value?.focus();
};
</script>
