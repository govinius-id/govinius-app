<template>
  <BaseDropdown ref="dropdownRef" :teleport-to="props.teleportTo">
    <template #activator="opts">
      <slot v-if="$slots.activator" name="activator" v-bind="opts"></slot>
      <BaseInput
        v-else
        ref="inputActivatorRef"
        :model-value="inputContent"
        :error="props.error"
        :label="props.label"
        :label-required="props.labelRequired"
        :label-optional="props.labelOptional"
        :placeholder="props.placeholder || 'dd mm yyy --:--:--'"
        :clearable="props.clearable"
        :disabled="props.disabled"
        :size="props.size"
        icon-prefix="ph:calendar-dots-duotone"
        readonly
        @click="opts.onToggle()"
        @keydown="
          $keydownPressKey($event, 'Enter', opts.onToggle);
          $keydownPressKey($event, 'Tab', opts.onClose);
        "
        @clear="onClear"
      />
    </template>
    <template #content>
      <BaseCard bordered shadow compact class="min-w-80">
        <div class="flex flex-col gap-y-4">
          <BaseCalendar
            v-model="inputDate"
            :start-date="props.startDate"
            :end-date="props.endDate"
            :disable-dates="props.disableDates"
            :events="props.events"
          />

          <BaseDividerHorizontal />

          <div class="justify-center-safe flex items-center gap-x-2 rounded-lg">
            <BaseIcon
              name="ph:clock-duotone"
              class="-ml-5 size-5 text-slate-400"
            />
            <BaseInput
              ref="inputHourRef"
              v-model="inputHour"
              size="sm"
              class="w-11"
              inputmode="numeric"
              @click="inputHourRef?.select()"
            />
            <div>:</div>
            <BaseInput
              ref="inputMinuteRef"
              v-model="inputMinute"
              size="sm"
              class="w-11"
              inputmode="numeric"
              @click="inputMinuteRef?.select()"
            />
            <div>:</div>
            <BaseInput
              ref="inputSecondRef"
              v-model="inputSecond"
              size="sm"
              class="w-11"
              inputmode="numeric"
              @click="inputSecondRef?.select()"
            />
          </div>
        </div>

        <div
          class="dark:bg-dark-900 -mx-2 -mb-2 mt-4 rounded-b-lg bg-slate-50 p-2"
        >
          <div class="flex justify-between gap-x-2">
            <BaseButton
              color="primary"
              variant="outlined"
              size="sm"
              @click="onSaveDatetimeNow()"
            >
              {{ $i18n().t('common.now') }}
            </BaseButton>
            <BaseButton color="primary" size="sm" @click="onSaveDatetime()">
              {{ $i18n().t('common.select') }}
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </template>
  </BaseDropdown>
</template>

<script lang="ts" setup>
interface Props {
  modelValue: any;
  teleportTo?: 'root' | 'activator';
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

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue) {
      inputDate.value = props.modelValue?.slice(0, 10);
    } else {
      inputDate.value = null;
    }
  },
);

const inputContent = computed(() => {
  if (!props.modelValue) return null;
  return $dayjs()
    .tz(props.modelValue, $timezone())
    .tz($timezone())
    .format('DD MMM YYYY, HH:mm:ss');
});

const inputDate = ref<string | null>(null);
const inputHour = ref<string>('00');
const inputHourRef = ref();
const inputMinute = ref<string>('00');
const inputMinuteRef = ref();
const inputSecond = ref<string>('00');
const inputSecondRef = ref();

watch(
  () => inputHour.value,
  () => {
    if (+inputHour.value > 23) {
      inputHour.value = '23';
    }
  },
);

watch(
  () => inputMinute.value,
  () => {
    if (+inputMinute.value > 59) {
      inputMinute.value = '59';
    }
  },
);

watch(
  () => inputSecond.value,
  () => {
    if (+inputSecond.value > 59) {
      inputSecond.value = '59';
    }
  },
);

const onSaveDatetime = () => {
  if (inputDate.value) {
    emit(
      'update:modelValue',
      `${inputDate.value} ${inputHour.value}:${inputMinute.value}:${inputSecond.value}`,
    );
  } else {
    emit('update:modelValue', null);
  }

  emit('select', props.modelValue);

  if (dropdownRef.value?.isOpen) {
    dropdownRef.value?.onClose();
  }
};

const onSaveDatetimeNow = () => {
  emit(
    'update:modelValue',
    $dayjs().tz().tz($timezone()).format('YYYY-MM-DD HH:mm:ss'),
  );

  emit('select', props.modelValue);

  if (dropdownRef.value?.isOpen) {
    dropdownRef.value?.onClose();
  }
};

const onClear = () => {
  inputDate.value = null;
  inputHour.value = '00';
  inputMinute.value = '00';
  inputSecond.value = '00';
  emit('update:modelValue', null);
  emit('clear');
};

const dropdownRef = ref();
const inputActivatorRef = ref();

watch(
  () => dropdownRef.value?.isOpen,
  () => {
    if (dropdownRef.value?.isOpen) {
      setTimeout(() => {
        if (props.modelValue) {
          const date = props.modelValue.slice(0, 10);
          const time = props.modelValue.slice(11, 20);

          const [hour, minute, second] = time.split(':');

          inputDate.value = date;
          inputHour.value = hour;
          inputMinute.value = minute;
          inputSecond.value = second;
        }
      }, 200);
    }
  },
);
</script>
