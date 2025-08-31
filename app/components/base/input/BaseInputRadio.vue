<template>
  <div
    :class="radioClass"
    :tabindex="props.disabled ? -1 : 0"
    @click="onChecked()"
    @keydown="
      $keydownPressKey($event, 'Enter', () => {
        onChecked();
      })
    "
  >
    <BaseIcon :name="radioIcon" :class="radioIconClass" size="lg" />
    <BaseText v-if="props.text" class="text-sm">
      {{ props.text }}
    </BaseText>
    <slot v-if="$slots.text" name="text"></slot>
    <input
      type="radio"
      :name="props.name"
      :value="props.modelValue"
      :checked="inputModel === props.value"
      class="hidden"
    />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  modelValue: string | number | null;
  name: string;
  value: string | number | null;
  text?: string;
  disabled?: boolean;
}

const emit = defineEmits(['update:modelValue']);
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

const radioClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('inline-flex items-center');
  itemsClass.push('size-fit');
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

const radioIcon = computed(() => {
  return inputModel.value === props.value
    ? 'ph:radio-button-fill'
    : 'ph:radio-button-duotone';
});

const radioIconClass = computed(() => {
  const itemsClass: string[] = [];

  if (!props.disabled) {
    itemsClass.push('group-focus:border-2');
    itemsClass.push('group-focus:border-primary');
    itemsClass.push('group-focus:rounded-full');
    itemsClass.push('dark:group-focus:border-primary-900');
  }

  if (inputModel.value === props.value) {
    itemsClass.push('text-primary');
  } else {
    itemsClass.push('text-slate-300');
  }

  return itemsClass.join(' ');
});

const onChecked = () => {
  if (props.disabled) return;
  inputModel.value = props.value;
};
</script>
