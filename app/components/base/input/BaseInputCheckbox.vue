<template>
  <div
    :class="checkboxClass"
    :tabindex="props.disabled ? -1 : 0"
    @click="onChecked()"
    @keydown="
      $keydownPressKey($event, 'Enter', () => {
        onChecked();
      })
    "
  >
    <BaseIcon :name="checkboxIcon" :class="checkboxIconClass" size="lg" />
    <div v-if="props.text || props.subtext" class="flex flex-col">
      <BaseText v-if="props.text" class="text-sm !leading-snug">
        {{ props.text }}
      </BaseText>
      <BaseText
        v-if="props.subtext"
        class="text-xs !leading-snug text-slate-400"
      >
        {{ props.subtext }}
      </BaseText>
    </div>
    <slot v-if="$slots.text" name="text"></slot>
    <input type="checkbox" class="hidden" :checked="inputModel" />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  modelValue: boolean;
  text?: string;
  subtext?: string;
  disabled?: boolean;
  error?: any;
}

const emit = defineEmits(['update:modelValue', 'checked']);
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const inputModel = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const checkboxClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('inline-flex');
  itemsClass.push('size-fit');
  itemsClass.push('select-none');
  itemsClass.push('gap-1');
  itemsClass.push('group');
  itemsClass.push('focus:outline-none');

  if (props.disabled) {
    itemsClass.push('cursor-not-allowed');
    itemsClass.push('opacity-50');
  } else {
    itemsClass.push('cursor-pointer');
  }

  return itemsClass.join(' ');
});

const checkboxIcon = computed(() => {
  return inputModel.value ? 'ph:check-square-fill' : 'ph:square';
});

const checkboxIconClass = computed(() => {
  const itemsClass: string[] = [];

  if (!props.disabled) {
    itemsClass.push('group-focus:border-2');
    itemsClass.push('group-focus:border-primary');
    itemsClass.push('group-focus:rounded-xs');
    itemsClass.push('dark:group-focus:border-primary-900');
  }

  if (inputModel.value) {
    itemsClass.push('text-success');
  } else if (props.error) {
    itemsClass.push('text-danger');
  } else {
    itemsClass.push('text-slate-300');
    itemsClass.push('dark:text-dark-700');
  }

  return itemsClass.join(' ');
});

const onChecked = () => {
  if (props.disabled) return;
  emit('checked', inputModel.value);
};
</script>
