<template>
  <div
    ref="switchRef"
    :class="switchBackgroundClass"
    tabindex="0"
    @click="onChange()"
    @keydown="$keydownPressKey($event, 'Enter', onChange)"
  >
    <div :class="switchContentClass">
      <div :class="switchCircleClass"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  modelValue: boolean;
  disabled?: boolean;
}

const emit = defineEmits(['update:modelValue', 'onChange']);
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

const switchRef = ref<HTMLElement | undefined>();

const onChange = () => {
  if (props.disabled) return;
  inputModel.value = !inputModel.value;
  emit('onChange', inputModel.value);
};

const switchBackgroundClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('inline-flex items-center justify-center');
  itemsClass.push('h-fit w-fit');
  itemsClass.push('p-0.5');
  itemsClass.push('rounded-full');
  itemsClass.push('focus:outline-2');
  itemsClass.push('focus:outline-primary');
  itemsClass.push('dark:focus:outline-primary-500');

  if (props.disabled) {
    itemsClass.push('cursor-not-allowed');
  } else {
    itemsClass.push('cursor-pointer');
  }

  if (props.modelValue) {
    itemsClass.push('bg-success');
  } else {
    itemsClass.push('bg-slate-200');
    itemsClass.push('dark:bg-dark-800');
  }

  return itemsClass.join(' ');
});

const switchContentClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('inline-flex items-center justify-start');
  itemsClass.push('h-6 w-12');
  itemsClass.push('rounded-full');

  return itemsClass.join(' ');
});

const switchCircleClass = computed(() => {
  const itemsClass: string[] = [];

  itemsClass.push('inline-flex items-center justify-center');
  itemsClass.push('h-6 w-6');
  itemsClass.push('rounded-full');
  itemsClass.push('transition-transform duration-300');
  itemsClass.push('bg-white');

  if (props.modelValue) {
    itemsClass.push('translate-x-6');
  }

  return itemsClass.join(' ');
});
</script>
