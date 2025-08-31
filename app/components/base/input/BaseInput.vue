<template>
  <BaseTextLabelContent
    :label="props.label"
    :label-required="props.labelRequired"
    :label-optional="props.labelOptional"
  >
    <div class="relative w-full">
      <div v-if="$slots.prefix" :class="inputPrefixWrapperClass">
        <slot name="prefix"></slot>
      </div>

      <div v-else-if="props.iconPrefix" :class="inputPrefixWrapperClass">
        <div :class="inputPrefixSuffixIconClass">
          <BaseIcon :name="props.iconPrefix" :size="props.size" />
        </div>
      </div>

      <input
        ref="inputRef"
        v-model="inputModel"
        :type="props.type"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :inputmode="props.inputmode"
        :tabindex="props.tabindex"
        :class="inputClass"
        @keydown="emit('keydown', $event)"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
        @click="emit('click', $event)"
      />

      <div
        v-if="$slots.content && props.modelValue"
        :class="inputContentWrapperClass"
        @click="emit('click')"
      >
        <slot name="content"></slot>
      </div>

      <div v-if="isClearable" :class="inputClearableWrapperClass">
        <div :class="inputClearableClass" @click="emit('clear')">
          <BaseIcon name="ph:x" :size="props.size" />
        </div>
      </div>

      <div v-if="$slots.suffix" :class="inputSuffixWrapperClass">
        <slot name="suffix"></slot>
      </div>

      <div v-else-if="props.iconSuffix" :class="inputSuffixWrapperClass">
        <div :class="inputPrefixSuffixIconClass">
          <BaseIcon :name="props.iconSuffix" :size="props.size" />
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
  type?: 'text' | 'password';
  inputmode?:
    | 'decimal'
    | 'email'
    | 'none'
    | 'numeric'
    | 'search'
    | 'tel'
    | 'text'
    | 'url';
  size?: 'sm' | 'md' | 'lg';
  iconPrefix?: string;
  iconSuffix?: string;
  tabindex?: number;
  classes?: {
    text?: string;
    padding?: string;
    clearable?: string;
  };
}

const slots = useSlots();

const emit = defineEmits([
  'update:modelValue',
  'clear',
  'click',
  'keydown',
  'focus',
  'blur',
]);
const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
});

const inputModel = computed({
  get() {
    return props.modelValue;
  },
  set(value: any) {
    emit('update:modelValue', value);
  },
});

const inputRef = ref<HTMLInputElement | undefined>();

const triggerFocus = () => {
  inputRef.value?.focus();
};

const triggerSelect = () => {
  inputRef.value?.select();
};

const isClearable = computed(() => {
  return props.clearable && props.modelValue && !props.disabled;
});

const inputClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('inline-flex');
  itemsClass.push('w-full');
  itemsClass.push('outline-1');
  itemsClass.push('rounded-md');
  itemsClass.push('placeholder:font-light');
  itemsClass.push('placeholder:text-slate-200');
  itemsClass.push('placeholder:select-none');
  itemsClass.push('focus:ring-2');
  itemsClass.push('focus:outline-none');
  itemsClass.push('dark:placeholder:text-slate-600');

  if (props.classes?.text) {
    itemsClass.push(props.classes.text);
  }

  if (slots.content) {
    itemsClass.push('text-transparent');
  } else {
    itemsClass.push('text-dark');
    itemsClass.push('dark:text-dark-100');
  }

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

  switch (props.size) {
    case 'sm':
      itemsClass.push('h-8');
      itemsClass.push('text-sm');
      break;
    case 'md':
      itemsClass.push('h-10');
      itemsClass.push('text-base');
      break;
    case 'lg':
      itemsClass.push('h-12');
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
    if (slots.prefix || props.iconPrefix) {
      itemsClass.push('pl-10');
    } else {
      itemsClass.push('pl-3');
    }

    if ((slots.suffix || props.iconSuffix) && props.clearable) {
      itemsClass.push('pr-16');
    } else if ((slots.suffix || props.iconSuffix) && !props.clearable) {
      itemsClass.push('pr-8');
    } else if (!slots.suffix && !props.iconSuffix && props.clearable) {
      itemsClass.push('pr-7');
    } else {
      itemsClass.push('pr-3');
    }
  }

  if (props.size === 'md') {
    if (slots.prefix || props.iconPrefix) {
      itemsClass.push('pl-13');
    } else {
      itemsClass.push('pl-3');
    }

    if ((slots.suffix || props.iconSuffix) && props.clearable) {
      itemsClass.push('pr-20');
    } else if ((slots.suffix || props.iconSuffix) && !props.clearable) {
      itemsClass.push('pr-13');
    } else if (!slots.suffix && !props.iconSuffix && props.clearable) {
      itemsClass.push('pr-10');
    } else {
      itemsClass.push('pr-3');
    }
  }

  if (props.size === 'lg') {
    if (slots.prefix || props.iconPrefix) {
      itemsClass.push('pl-14');
    } else {
      itemsClass.push('pl-4');
    }

    if ((slots.suffix || props.iconSuffix) && props.clearable) {
      itemsClass.push('pr-20');
    } else if ((slots.suffix || props.iconSuffix) && !props.clearable) {
      itemsClass.push('pr-14');
    } else if (!slots.suffix && !props.iconSuffix && props.clearable) {
      itemsClass.push('pr-12');
    } else {
      itemsClass.push('pr-4');
    }
  }

  return itemsClass.join(' ');
});

const inputContentWrapperClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('absolute');
  itemsClass.push('left-0');
  itemsClass.push('top-0');
  itemsClass.push('z-[2]');
  itemsClass.push('h-full');
  itemsClass.push('w-full');
  itemsClass.push('select-none');
  itemsClass.push('overflow-hidden');

  if (props.classes?.padding) {
    itemsClass.push(props.classes.padding);
  } else {
    itemsClass.push(inputPaddingClass.value);
  }

  if (props.disabled) {
    itemsClass.push('pointer-events-none');
  }

  return itemsClass.join(' ');
});

const inputPrefixSuffixIconClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('inline-flex');
  itemsClass.push('aspect-square');
  itemsClass.push('h-full');
  itemsClass.push('items-center');
  itemsClass.push('justify-center');
  itemsClass.push('text-slate-400');

  return itemsClass.join(' ');
});

const inputPrefixWrapperClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('absolute');
  itemsClass.push('left-0');
  itemsClass.push('top-0');
  itemsClass.push('z-[3]');
  itemsClass.push('flex');
  itemsClass.push('h-full');
  itemsClass.push('w-fit');
  itemsClass.push('select-none');
  itemsClass.push('overflow-hidden');
  itemsClass.push('rounded-l-md');
  itemsClass.push('bg-slate-50');
  itemsClass.push('dark:bg-dark-900');

  if (props.disabled) {
    itemsClass.push('pointer-events-none');
  }

  return itemsClass.join(' ');
});

const inputSuffixWrapperClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('absolute');
  itemsClass.push('right-0');
  itemsClass.push('top-0');
  itemsClass.push('z-[3]');
  itemsClass.push('flex');
  itemsClass.push('h-full');
  itemsClass.push('w-fit');
  itemsClass.push('select-none');
  itemsClass.push('overflow-hidden');
  itemsClass.push('rounded-r-md');
  itemsClass.push('bg-slate-50');
  itemsClass.push('dark:bg-dark-900');

  if (props.disabled) {
    itemsClass.push('pointer-events-none');
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

  if (props.size === 'sm') {
    if (slots.suffix || props.iconSuffix) {
      itemsClass.push('pr-10');
    }
  }

  if (props.size === 'md') {
    if (slots.suffix || props.iconSuffix) {
      itemsClass.push('pr-13');
    }
  }

  if (props.size === 'lg') {
    if (slots.suffix || props.iconSuffix) {
      itemsClass.push('pr-14');
    }
  }

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
