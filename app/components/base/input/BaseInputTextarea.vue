<template>
  <BaseTextLabelContent
    :label="props.label"
    :label-required="props.labelRequired"
    :label-optional="props.labelOptional"
  >
    <div class="relative w-full">
      <textarea
        ref="textareaRef"
        v-model="inputModel"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :rows="props.rows"
        :class="inputClass"
        @keydown="emit('keydown', $event)"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
        @click="emit('click', $event)"
      ></textarea>

      <div v-if="isClearable" :class="inputClearableWrapperClass">
        <div :class="inputClearableClass" @click="emit('clear')">
          <BaseIcon name="ph:x" :size="props.size" />
        </div>
      </div>
    </div>

    <div v-if="props.error" class="text-danger text-xs">
      {{ props.error }}
    </div>
  </BaseTextLabelContent>
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
  rows?: number;
  classes?: {
    text?: string;
    padding?: string;
    clearable?: string;
  };
}

const emit = defineEmits([
  'update:modelValue',
  'clear',
  'click',
  'keydown',
  'focus',
  'blur',
]);
const props = withDefaults(defineProps<Props>(), {
  rows: 3,
  size: 'md',
});

const inputModel = computed({
  get() {
    return props.modelValue;
  },
  set(value: string | null) {
    emit('update:modelValue', value);
  },
});

const textareaRef = ref<HTMLInputElement | undefined>();

const triggerFocus = () => {
  textareaRef.value?.focus();
};

const triggerSelect = () => {
  textareaRef.value?.select();
};

const isClearable = computed(() => {
  return props.clearable && props.modelValue && !props.disabled;
});

const inputClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('inline-flex');
  itemsClass.push('w-full');
  itemsClass.push('text-dark');
  itemsClass.push('outline-1');
  itemsClass.push('rounded-md');
  itemsClass.push('placeholder:font-light');
  itemsClass.push('placeholder:text-slate-200');
  itemsClass.push('placeholder:select-none');
  itemsClass.push('focus:ring-2');
  itemsClass.push('focus:outline-none');
  itemsClass.push('dark:text-dark-100');
  itemsClass.push('dark:placeholder:text-slate-600');

  if (props.disabled) {
    itemsClass.push('bg-slate-50');
    itemsClass.push('dark:bg-dark-900');
  } else {
    itemsClass.push('bg-white');
    itemsClass.push('dark:bg-dark-950');
  }

  if (props.error) {
    itemsClass.push('outline-danger-500');
    itemsClass.push('focus:ring-danger-500');
    itemsClass.push('dark:outline-danger-900');
    itemsClass.push('dark:focus:ring-danger-900');
  } else {
    itemsClass.push('outline-slate-300');
    itemsClass.push('focus:ring-primary');
    itemsClass.push('dark:outline-dark-700');
    itemsClass.push('dark:focus:ring-primary');
  }

  if (props.classes?.padding) {
    itemsClass.push(props.classes.padding);
  } else {
    itemsClass.push(inputPaddingClass.value);
  }

  if (props.disabled) {
    itemsClass.push('bg-slate-50');
    itemsClass.push('dark:bg-dark-900');
  } else {
    itemsClass.push('bg-white');
    itemsClass.push('dark:bg-dark-950');
  }

  switch (props.size) {
    case 'sm':
      itemsClass.push('min-h-8');
      itemsClass.push('pt-2');
      itemsClass.push('text-sm');
      break;
    case 'md':
      itemsClass.push('min-h-10');
      itemsClass.push('pt-2.5');
      itemsClass.push('text-base');
      break;
    case 'lg':
      itemsClass.push('min-h-12');
      itemsClass.push('pt-3');
      itemsClass.push('text-lg');
      break;
  }

  if (props.disabled) {
    itemsClass.push('cursor-not-allowed');
  } else if (props.loading) {
    itemsClass.push('cursor-progress');
  } else if (props.readonly) {
    itemsClass.push('cursor-default');
  } else {
    itemsClass.push('cursor-text');
  }

  return itemsClass.join(' ');
});

const inputPaddingClass = computed(() => {
  const itemsClass: string[] = [];

  if (props.size === 'sm') {
    itemsClass.push('pl-3');

    if (props.clearable) {
      itemsClass.push('pr-7');
    } else {
      itemsClass.push('pr-3');
    }
  }

  if (props.size === 'md') {
    itemsClass.push('pl-3');

    if (props.clearable) {
      itemsClass.push('pr-10');
    } else {
      itemsClass.push('pr-3');
    }
  }

  if (props.size === 'lg') {
    itemsClass.push('pl-4');

    if (props.clearable) {
      itemsClass.push('pr-12');
    } else {
      itemsClass.push('pr-4');
    }
  }

  return itemsClass.join(' ');
});

const inputClearableClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('text-danger');
  itemsClass.push('flex');
  itemsClass.push('aspect-square');
  itemsClass.push('h-full');
  itemsClass.push('cursor-pointer');
  itemsClass.push('items-center');
  itemsClass.push('justify-center');

  return itemsClass.join(' ');
});

const inputClearableWrapperClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('absolute');
  itemsClass.push('right-0');
  itemsClass.push('top-0');
  itemsClass.push('z-[2]');
  itemsClass.push('select-none');
  itemsClass.push('overflow-hidden');

  switch (props.size) {
    case 'sm':
      itemsClass.push('h-8 min-w-8');
      break;
    case 'md':
      itemsClass.push('h-10 min-w-10');
      break;
    case 'lg':
      itemsClass.push('h-12 min-w-12');
      break;
  }

  if (props.disabled) {
    itemsClass.push('pointer-events-none');
  }

  return itemsClass.join(' ');
});

defineExpose({
  focus: triggerFocus,
  select: triggerSelect,
});
</script>
