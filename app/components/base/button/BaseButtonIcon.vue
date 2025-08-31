<template>
  <NuxtLink
    v-if="props.to"
    ref="buttonRef"
    :to="props.to"
    :type="props.type"
    :class="buttonClass"
    :disabled="props.disabled"
    tabindex="-1"
  >
    <BaseIcon
      v-if="buttonLoading"
      name="mingcute:loading-3-fill"
      class="animate-spin"
      :size="props.size"
    />
    <BaseIcon v-else :name="props.icon" :size="props.size" />
  </NuxtLink>

  <button
    v-else
    ref="buttonRef"
    :type="props.type"
    :class="buttonClass"
    :disabled="props.disabled"
    tabindex="-1"
  >
    <BaseIcon
      v-if="buttonLoading"
      name="mingcute:loading-3-fill"
      class="animate-spin"
      :size="props.size"
    />
    <BaseIcon v-else :name="props.icon" :size="props.size" />
  </button>
</template>

<script lang="ts" setup>
interface Props {
  icon: string;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'rounded' | 'full';
  to?: string | object;
  classes?: {
    icon?: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  size: 'md',
  rounded: 'full',
});

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

const buttonRef = ref();

const onFocus = () => {
  buttonRef.value?.focus();
};

const buttonClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('inline-flex items-center justify-center');
  itemsClass.push('w-fit');
  itemsClass.push('aspect-square');
  itemsClass.push('whitespace-nowrap');
  itemsClass.push('select-none');

  switch (props.size) {
    case 'sm':
      itemsClass.push('min-w-8');
      break;
    case 'md':
      itemsClass.push('min-w-9');
      break;
    case 'lg':
      itemsClass.push('min-w-10');
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

  itemsClass.push('bg-white');
  itemsClass.push('outline-1');
  itemsClass.push('outline-slate-200');
  itemsClass.push('hover:bg-slate-50/80');
  itemsClass.push('dark:text-dark-400');
  itemsClass.push('dark:bg-dark-950');
  itemsClass.push('dark:outline-dark-700');
  itemsClass.push('dark:hover:bg-dark-900/80');

  if (props.classes?.icon) {
    itemsClass.push(props.classes.icon);
  } else {
    itemsClass.push('text-slate-400');
  }

  if (props.disabled || props.loading || buttonLoading.value) {
    itemsClass.push('pointer-events-none');
  } else {
    itemsClass.push('cursor-pointer');
  }

  return itemsClass.join(' ');
});

defineExpose({
  focus: onFocus,
});
</script>
