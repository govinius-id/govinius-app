<template>
  <BaseDropdown ref="dropdownRef">
    <template #activator="opts">
      <BaseInput
        ref="inputActivatorRef"
        v-model="inputModel"
        :error="props.error"
        :label="props.label"
        :label-required="props.labelRequired"
        :label-optional="props.labelOptional"
        :placeholder="props.placeholder || '--:--:--'"
        :clearable="props.clearable"
        :disabled="props.disabled"
        icon-prefix="ph:clock-duotone"
        readonly
        @click="opts.onToggle()"
        @keydown="
          $keydownPressKey($event, 'Enter', opts.onToggle);
          $keydownPressKey($event, 'Tab', opts.onClose);
        "
        @clear="onClearTime()"
      />
    </template>
    <template #content>
      <BaseCard bordered shadow compact class="min-w-64">
        <div class="flex items-center justify-center gap-x-2">
          <BaseInput
            ref="inputHourRef"
            v-model="inputHour"
            size="sm"
            class="w-11"
            inputmode="numeric"
            @click="inputHourRef?.select()"
            @keydown="
              $keydownPressKey($event, 'Enter', () => {
                onSaveTime();
              })
            "
          />
          <div>:</div>
          <BaseInput
            ref="inputMinuteRef"
            v-model="inputMinute"
            size="sm"
            class="w-11"
            inputmode="numeric"
            @click="inputMinuteRef?.select()"
            @keydown="
              $keydownPressKey($event, 'Enter', () => {
                onSaveTime();
              })
            "
          />
          <div>:</div>
          <BaseInput
            ref="inputSecondRef"
            v-model="inputSecond"
            size="sm"
            class="w-11"
            inputmode="numeric"
            @click="inputSecondRef?.select()"
            @keydown="
              $keydownPressKey($event, 'Enter', () => {
                onSaveTime();
              })
            "
          />
        </div>
        <div
          class="dark:bg-dark-900 -mx-2 -mb-2 mt-4 rounded-b-lg bg-slate-50 p-2"
        >
          <div class="flex justify-end">
            <BaseButton color="primary" size="sm" @click="onSaveTime()">
              {{ $i18n().t('common.ok') }}
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
const props = defineProps<Props>();

const inputModel = computed({
  get() {
    return props.modelValue;
  },
  set(value: string | null) {
    emit('update:modelValue', value);
  },
});

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

const onSaveTime = () => {
  inputModel.value = `${inputHour.value}:${inputMinute.value}:${inputSecond.value}`;
  if (dropdownRef.value?.isOpen) {
    dropdownRef.value?.onClose();
  }
};

const onClearTime = () => {
  inputHour.value = '00';
  inputMinute.value = '00';
  inputSecond.value = '00';
  inputModel.value = null;
  emit('clear');
};

const dropdownRef = ref();
const inputActivatorRef = ref();

watch(
  () => dropdownRef.value?.isOpen,
  () => {
    if (dropdownRef.value?.isOpen) {
      setTimeout(() => {
        if (inputModel.value) {
          const [hour, minute, second] = inputModel.value.split(':');
          inputHour.value = hour;
          inputMinute.value = minute;
          inputSecond.value = second;
        }

        setTimeout(() => {
          inputHourRef.value?.select();
        }, 100);
      }, 200);
    }
  },
);
</script>
