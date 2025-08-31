<template>
  <NuxtLink v-if="props.to" ref="buttonRef" :to="props.to" :class="buttonClass">
    <BaseIcon
      v-if="buttonLoading"
      name="mingcute:loading-3-fill"
      :class="buttonLoadingClass"
      :size="props.size"
    />
    <BaseIcon
      v-if="!buttonLoading && props.iconPrefix"
      :name="props.iconPrefix"
      :size="props.size"
      class="text-inherit"
    />
    <slot v-if="!buttonLoading"></slot>
    <BaseIcon
      v-if="!buttonLoading && props.iconSuffix"
      :name="props.iconSuffix"
      :size="props.size"
      class="text-inherit"
    />
  </NuxtLink>

  <button
    v-else
    ref="buttonRef"
    :type="props.type"
    :class="buttonClass"
    :disabled="props.disabled"
  >
    <BaseIcon
      v-if="buttonLoading"
      name="mingcute:loading-3-fill"
      :class="buttonLoadingClass"
      :size="props.size"
    />
    <BaseIcon
      v-if="!buttonLoading && props.iconPrefix"
      :name="props.iconPrefix"
      :size="props.size"
      class="text-inherit"
    />
    <slot v-if="!buttonLoading"></slot>
    <BaseIcon
      v-if="!buttonLoading && props.iconSuffix"
      :name="props.iconSuffix"
      :size="props.size"
      class="text-inherit"
    />
  </button>
</template>

<script lang="ts" setup>
import type {
  RouteLocationAsRelativeGeneric,
  RouteLocationAsPathGeneric,
} from '#vue-router';

interface Props {
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  disabled?: boolean;
  color?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'danger';
  variant?: 'default' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'rounded' | 'full';
  to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
  iconPrefix?: string;
  iconSuffix?: string;
  classes?: {
    color?: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  color: 'default',
  variant: 'default',
  rounded: 'rounded',
  size: 'md',
});

const buttonRef = ref();

const buttonLoading = ref(false);
const timeoutLoading = ref();

watch(
  () => props.loading,
  () => {
    if (props.loading) {
      clearTimeout(timeoutLoading.value);
      buttonLoading.value = true;
    } else {
      timeoutLoading.value = setTimeout(() => {
        buttonLoading.value = false;
      }, 500);
    }
  },
  { immediate: true },
);

const buttonClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('inline-flex items-center justify-center');
  itemsClass.push('whitespace-nowrap');
  itemsClass.push('select-none');

  switch (props.size) {
    case 'sm':
      itemsClass.push('h-8 min-w-16');
      itemsClass.push('text-xs');
      itemsClass.push('px-3');
      itemsClass.push('gap-x-1');
      break;
    case 'md':
      itemsClass.push('h-10 min-w-22');
      itemsClass.push('text-sm');
      itemsClass.push('px-4');
      itemsClass.push('gap-x-2');
      break;
    case 'lg':
      itemsClass.push('h-12 min-w-28');
      itemsClass.push('text-base');
      itemsClass.push('px-5');
      itemsClass.push('gap-x-3');
      break;
  }

  switch (props.rounded) {
    case 'rounded':
      itemsClass.push('rounded-md');
      break;
    case 'full':
      itemsClass.push('rounded-full');
      break;
  }

  if (props.classes?.color) {
    itemsClass.push(props.classes.color);
  } else if (props.variant === 'default') {
    switch (props.color) {
      case 'primary':
        itemsClass.push('bg-primary');
        itemsClass.push('text-white');
        itemsClass.push('hover:bg-primary/80');
        itemsClass.push('focus:outline-none');
        itemsClass.push('focus:ring-2');
        itemsClass.push('focus:ring-primary/40');
        itemsClass.push('disabled:bg-primary/80');
        itemsClass.push('dark:bg-primary');
        itemsClass.push('dark:text-white');
        itemsClass.push('dark:hover:bg-primary/80');
        itemsClass.push('dark:disabled:bg-primary/80');
        break;
      case 'info':
        itemsClass.push('bg-info');
        itemsClass.push('text-white');
        itemsClass.push('hover:bg-info/80');
        itemsClass.push('focus:outline-none');
        itemsClass.push('focus:ring-2');
        itemsClass.push('focus:ring-info/40');
        itemsClass.push('disabled:bg-info/80');
        itemsClass.push('dark:bg-info');
        itemsClass.push('dark:text-white');
        itemsClass.push('dark:hover:bg-info/80');
        itemsClass.push('dark:disabled:bg-info/80');
        break;
      case 'success':
        itemsClass.push('bg-success');
        itemsClass.push('text-white');
        itemsClass.push('hover:bg-success/80');
        itemsClass.push('focus:outline-none');
        itemsClass.push('focus:ring-2');
        itemsClass.push('focus:ring-success/40');
        itemsClass.push('disabled:bg-success/80');
        itemsClass.push('dark:bg-success');
        itemsClass.push('dark:text-white');
        itemsClass.push('dark:hover:bg-success/80');
        itemsClass.push('dark:disabled:bg-success/80');
        break;
      case 'warning':
        itemsClass.push('bg-warning');
        itemsClass.push('text-white');
        itemsClass.push('hover:bg-warning/80');
        itemsClass.push('focus:outline-none');
        itemsClass.push('focus:ring-2');
        itemsClass.push('focus:ring-warning/40');
        itemsClass.push('disabled:bg-warning/80');
        itemsClass.push('dark:bg-warning');
        itemsClass.push('dark:text-white');
        itemsClass.push('dark:hover:bg-warning/80');
        itemsClass.push('dark:disabled:bg-warning/80');
        break;
      case 'danger':
        itemsClass.push('bg-danger');
        itemsClass.push('text-white');
        itemsClass.push('hover:bg-danger/80');
        itemsClass.push('focus:outline-none');
        itemsClass.push('focus:ring-2');
        itemsClass.push('focus:ring-danger/40');
        itemsClass.push('disabled:bg-danger/80');
        itemsClass.push('dark:bg-danger');
        itemsClass.push('dark:text-white');
        itemsClass.push('dark:hover:bg-danger/80');
        itemsClass.push('dark:disabled:bg-danger/80');
        break;
      default:
        itemsClass.push('bg-white');
        itemsClass.push('text-dark');
        itemsClass.push('outline-1');
        itemsClass.push('outline-slate-200');
        itemsClass.push('hover:bg-slate-50/80');
        itemsClass.push('focus:bg-slate-50/80');
        itemsClass.push('disabled:bg-slate-50/80');
        itemsClass.push('dark:text-dark-100');
        itemsClass.push('dark:bg-dark-950');
        itemsClass.push('dark:outline-dark-700');
        itemsClass.push('dark:hover:bg-dark-900/80');
        itemsClass.push('dark:focus:bg-dark-900/80');
        itemsClass.push('dark:disabled:bg-dark-900/80');
        break;
    }
  } else if (props.variant === 'outlined') {
    switch (props.color) {
      case 'primary':
        itemsClass.push('border');
        itemsClass.push('border-primary');
        itemsClass.push('text-primary');
        itemsClass.push('hover:bg-primary/5');
        itemsClass.push('focus:bg-primary/5');
        itemsClass.push('focus:outline-none');
        itemsClass.push('disabled:bg-primary/10');
        itemsClass.push('dark:text-white');
        itemsClass.push('dark:hover:bg-primary/20');
        itemsClass.push('dark:focus:bg-primary/20');
        break;
      case 'info':
        itemsClass.push('border');
        itemsClass.push('border-info');
        itemsClass.push('text-info');
        itemsClass.push('hover:bg-info/5');
        itemsClass.push('focus:bg-info/5');
        itemsClass.push('focus:outline-none');
        itemsClass.push('disabled:bg-info/10');
        itemsClass.push('dark:text-white');
        itemsClass.push('dark:hover:bg-info/20');
        itemsClass.push('dark:focus:bg-info/20');
        break;
      case 'success':
        itemsClass.push('border');
        itemsClass.push('border-success');
        itemsClass.push('text-success');
        itemsClass.push('hover:bg-success/5');
        itemsClass.push('focus:bg-success/5');
        itemsClass.push('focus:outline-none');
        itemsClass.push('disabled:bg-success/10');
        itemsClass.push('dark:text-white');
        itemsClass.push('dark:hover:bg-success/20');
        itemsClass.push('dark:focus:bg-success/20');
        break;
      case 'warning':
        itemsClass.push('border');
        itemsClass.push('border-warning');
        itemsClass.push('text-warning');
        itemsClass.push('hover:bg-warning/5');
        itemsClass.push('focus:bg-warning/5');
        itemsClass.push('focus:outline-none');
        itemsClass.push('disabled:bg-warning/10');
        itemsClass.push('dark:text-white');
        itemsClass.push('dark:hover:bg-warning/20');
        itemsClass.push('dark:focus:bg-warning/20');
        break;
      case 'danger':
        itemsClass.push('border');
        itemsClass.push('border-danger');
        itemsClass.push('text-danger');
        itemsClass.push('hover:bg-danger/5');
        itemsClass.push('focus:bg-danger/5');
        itemsClass.push('focus:outline-none');
        itemsClass.push('disabled:bg-danger/10');
        itemsClass.push('dark:text-white');
        itemsClass.push('dark:hover:bg-danger/20');
        itemsClass.push('dark:focus:bg-danger/20');
        break;
      default:
        itemsClass.push('border');
        itemsClass.push('border-dark');
        itemsClass.push('text-dark');
        itemsClass.push('hover:bg-slate-50');
        itemsClass.push('focus:bg-slate-50');
        itemsClass.push('focus:outline-none');
        itemsClass.push('disabled:bg-slate-100');
        itemsClass.push('dark:border-dark-200');
        itemsClass.push('dark:text-white');
        itemsClass.push('dark:hover:bg-dark-900');
        itemsClass.push('dark:focus:bg-dark-900');
        break;
    }
  }

  if (props.disabled || props.loading || buttonLoading.value) {
    itemsClass.push('pointer-events-none');
  } else {
    itemsClass.push('cursor-pointer');
  }

  return itemsClass.join(' ');
});

const buttonLoadingClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('animate-spin');

  if (props.classes?.color) {
    itemsClass.push('text-inherit');
  } else if (props.variant === 'default' && props.color === 'default') {
    itemsClass.push('text-slate-400');
  } else if (props.variant === 'default' && props.color !== 'default') {
    itemsClass.push('text-white');
  }

  return itemsClass.join(' ');
});

const triggerFocus = () => {
  buttonRef.value?.focus();
};

const triggerClick = () => {
  buttonRef.value?.click();
};

defineExpose({
  focus: triggerFocus,
  click: triggerClick,
});
</script>
